import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { defaults, migrateSettings } from "../../src/core/settings";
import {
  isSelectorData,
  safeSelector,
  newerOrEqual,
} from "../../src/core/schema";
import {
  bundledSelectors,
  chooseSelectors,
  fetchSelectors,
  MAX_SELECTOR_BYTES,
} from "../../src/core/selectors-store";
import { detect, isWatchPage } from "../../src/sites/youtube/detect";
import { buildCss } from "../../src/sites/youtube/restore.css";
import { reportDetails, reportLinks } from "../../src/core/report";
import { widthBucket, isStatus, type Status } from "../../src/core/messages";
import { shouldShowRating } from "../../src/core/rating";

const copy = () => structuredClone(bundledSelectors);
const fixture = (name: string) =>
  new DOMParser().parseFromString(
    readFileSync(
      `tests/fixtures/youtube/2026-10-14-${name}-normal.html`,
      "utf8",
    ),
    "text/html",
  );
describe("settings and migration", () => {
  it("uses conservative defaults on first install", () =>
    expect(migrateSettings(undefined)).toEqual(defaults));
  it("keeps valid old settings and fills missing fields", () =>
    expect(
      migrateSettings({ schema: 0, enabled: false, hideAiSearch: true }),
    ).toEqual({ ...defaults, enabled: false, hideAiSearch: true }));
  it("repairs individual corrupt values without losing valid keys", () =>
    expect(
      migrateSettings({
        schema: 99,
        enabled: false,
        hideAiSearch: "yes",
        spoilerShield: true,
        playerWidth: "huge",
      }),
    ).toEqual({ ...defaults, enabled: false, spoilerShield: true }));
  it.each([null, 7, "yes", []])("handles corrupt root %j", (input) =>
    expect(migrateSettings(input)).toEqual(defaults),
  );
});
describe("untrusted selector data", () => {
  it("accepts bundled data", () => expect(isSelectorData(copy())).toBe(true));
  it("rejects unknown schema versions", () =>
    expect(isSelectorData({ ...copy(), schemaVersion: 2 })).toBe(false));
  it("rejects a single required detection signal", () => {
    const d = copy();
    d.detection.newLayoutSignals.requireAll = ["ytd-watch-flexy"];
    expect(isSelectorData(d)).toBe(false);
  });
  it.each([
    "<script>alert(1)</script>",
    "javascript:alert(1)",
    "div{}body{display:none}",
    "div;display:none",
    "div/*comment*/",
    "div\\7b",
    "div@import",
    "div::before",
    "[",
    "div:not(",
    "div:unknown",
  ])("rejects injection or malformed selector %s", (s) => {
    expect(safeSelector(s)).toBe(false);
    const d = copy();
    d.containers.player = s;
    expect(isSelectorData(d)).toBe(false);
  });
  it("rejects unknown fields and prototype-style feature keys", () => {
    expect(isSelectorData({ ...copy(), script: "anything" })).toBe(false);
    const d = copy();
    Object.assign(d.killSwitch.features, { constructor: true });
    expect(isSelectorData(d)).toBe(false);
  });
  it("rejects missing or non-boolean feature switches", () => {
    const d = copy();
    Object.assign(d.killSwitch.features, { restoreLayout: "false" });
    expect(isSelectorData(d)).toBe(false);
  });
  it("validates every bundled selector in an actual selector engine", () => {
    const doc = fixture("new");
    for (const selector of Object.values(bundledSelectors.containers))
      expect(() => doc.querySelector(selector)).not.toThrow();
  });
  it("never chooses an invalid cached file", () =>
    expect(chooseSelectors({ data: { ...copy(), schemaVersion: 2 } })).toBe(
      bundledSelectors,
    ));
  it("does not roll back to an older cached version", () =>
    expect(
      chooseSelectors({ data: { ...copy(), dataVersion: "2026-10-13.9" } }),
    ).toBe(bundledSelectors));
  it("compares numeric revisions rather than lexicographic suffixes", () => {
    expect(newerOrEqual("2026-10-14.10", "2026-10-14.9")).toBe(true);
    expect(newerOrEqual("2026-10-14.2", "2026-10-14.10")).toBe(false);
  });
  it("accepts valid newer remote data with credentials omitted", async () => {
    const d = { ...copy(), dataVersion: "2026-10-14.2" };
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify(d)));
    expect(
      await fetchSelectors(
        "https://owner.github.io/undo/selectors.json",
        bundledSelectors,
        f,
      ),
    ).toEqual(d);
    expect(f.mock.calls[0]?.[1]).toMatchObject({
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
    });
  });
  it.each([
    "{broken",
    JSON.stringify({ ...copy(), schemaVersion: 9 }),
    JSON.stringify({ ...copy(), dataVersion: "2026-10-13.1" }),
    "x".repeat(MAX_SELECTOR_BYTES + 1),
  ])(
    "rejects malformed, incompatible, stale or oversized remote data",
    async (body) => {
      expect(
        await fetchSelectors(
          "https://example.com/selectors.json",
          bundledSelectors,
          vi.fn().mockResolvedValue(new Response(body)),
        ),
      ).toBeNull();
    },
  );
  it("keeps the last good copy when offline", async () =>
    expect(
      await fetchSelectors(
        "https://example.com/selectors.json",
        bundledSelectors,
        vi.fn().mockRejectedValue(new Error("offline")),
      ),
    ).toBeNull());
  it("does not request non-HTTPS or credential-bearing endpoints", async () => {
    const f = vi.fn();
    expect(
      await fetchSelectors("http://example.com/data", bundledSelectors, f),
    ).toBeNull();
    expect(
      await fetchSelectors(
        "https://user:pass@example.com/data",
        bundledSelectors,
        f,
      ),
    ).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
});
describe("layout detection", () => {
  it.each(["new", "classic"] as const)(
    "recognises the full scrubbed live %s snapshot",
    (layout) => {
      const html = readFileSync(
        `tests/fixtures/youtube/2026-10-14-${layout}-live-scrubbed.html`,
        "utf8",
      );
      expect(html.endsWith("</body></html>")).toBe(true);
      expect(html).not.toMatch(
        /https?:\/\/|content-id-|rahul|@freyr|redir_token|channel_creation_token/i,
      );
      const doc = new DOMParser().parseFromString(html, "text/html");
      expect(detect(doc, copy()).layout).toBe(layout);
    },
  );
  it("recognises the observed new structure", () =>
    expect(detect(fixture("new"), copy()).layout).toBe("new"));
  it("recognises the observed classic structure", () =>
    expect(detect(fixture("classic"), copy()).layout).toBe("classic"));
  it("does not infer new layout from one attribute", () => {
    const doc = fixture("new");
    doc.querySelector("#related")!.remove();
    expect(detect(doc, copy()).layout).toBe("unknown");
  });
  it("does not apply to unfamiliar markup", () =>
    expect(
      detect(
        new DOMParser().parseFromString("<main>unfamiliar</main>", "text/html"),
        copy(),
      ).layout,
    ).toBe("unknown"));
  it("does not treat simultaneous conflicting signals as recognised", () => {
    const d = copy();
    d.detection.classicLayoutSignals = d.detection.newLayoutSignals;
    expect(detect(fixture("new"), d).layout).toBe("unknown");
  });
  it("tolerates invalid selector syntax without throwing", () => {
    const d = copy();
    d.detection.newLayoutSignals.requireAll[0] = "[";
    expect(detect(fixture("new"), d).layout).toBe("unknown");
  });
  it.each([
    "https://www.youtube.com/shorts/123",
    "https://music.youtube.com/watch?v=123",
    "https://m.youtube.com/watch?v=123",
    "https://www.youtube.com/embed/123",
    "https://www.youtube.com/results",
    "https://example.com/watch",
  ])("excludes %s", (url) => expect(isWatchPage(new URL(url))).toBe(false));
  it("allows exact www watch route", () =>
    expect(
      isWatchPage(new URL("https://www.youtube.com/watch?v=123&t=90")),
    ).toBe(true));
});
describe("privacy, CSS and release contracts", () => {
  const status: Status = {
    page: "watch",
    layout: "new",
    approach: "css",
    signals: [{ index: 0, group: "newAll", matched: true }],
    dataVersion: "2026-10-14.1",
    active: true,
    paused: false,
    message: "",
    widthBucket: "1920 to 2559",
  };
  it("includes only allowlisted diagnostics", () => {
    const details = reportDetails(
      "0.1.0",
      "Mozilla/5.0 (Windows NT 10.0) Chrome/140.0.0.0",
      status,
    );
    expect(details).toContain("Chromium 140.0.0.0");
    expect(details).toContain("newAll[0]=matched");
    expect(details).not.toMatch(/https?:|watch\?|cookie|account|title/i);
  });
  it("uses the issue form field and email fallback without automatic sending", () => {
    const links = reportLinks(
      "safe details",
      "https://github.com/owner/undo/issues/new",
      "owner@example.com",
    );
    expect(new URL(links.issue).searchParams.get("diagnostics")).toBe(
      "safe details",
    );
    expect(new URL(links.issue).searchParams.get("template")).toBe(
      "broken-layout.yml",
    );
    expect(links.email).toContain("mailto:owner@example.com");
  });
  it("keeps placeholder report destinations inert", () =>
    expect(reportLinks("safe", "", "")).toEqual({ issue: "", email: "" }));
  it("validates status envelopes before use", () => {
    expect(isStatus(status)).toBe(true);
    expect(isStatus({ ...status, widthBucket: "secret video title" })).toBe(
      false,
    );
    expect(
      isStatus({
        ...status,
        signals: [{ index: 0, group: "video title", matched: true }],
      }),
    ).toBe(false);
  });
  it("uses width buckets rather than exact dimensions", () =>
    expect([1023, 1024, 1920, 2560, 3440].map(widthBucket)).toEqual([
      "under 1024",
      "1024 to 1919",
      "1920 to 2559",
      "2560 to 3439",
      "3440 and above",
    ]));
  it("gates restore CSS on both settings and recognised layout", () => {
    const css = buildCss(copy());
    expect(css).toContain('html[data-undo-yt="on"][data-undo-yt-layout="new"]');
    expect(css).toContain(":not([fullscreen])");
    expect(css).toContain("@media(min-width:1921px)");
    expect(css).not.toContain("url(");
  });
  it("only asks for a rating after both thresholds", () => {
    const now = 8 * 86400000;
    expect(
      shouldShowRating(
        { installedAt: 0, restoredViews: 20, ratingPrompt: "pending" },
        now,
      ),
    ).toBe(true);
    expect(
      shouldShowRating(
        { installedAt: 0, restoredViews: 19, ratingPrompt: "pending" },
        now,
      ),
    ).toBe(false);
    expect(
      shouldShowRating(
        { installedAt: 0, restoredViews: 20, ratingPrompt: "pending" },
        6 * 86400000,
      ),
    ).toBe(false);
    expect(
      shouldShowRating(
        { installedAt: 0, restoredViews: 30, ratingPrompt: "dismissed" },
        now,
      ),
    ).toBe(false);
  });
  it("keeps permissions and host matching narrow", () => {
    const m = JSON.parse(readFileSync("manifest.json", "utf8"));
    expect(m.permissions).toEqual(["storage", "alarms"]);
    expect(m.host_permissions).toBeUndefined();
    expect(m.content_scripts).toHaveLength(2);
    for (const script of m.content_scripts) {
      expect(script.matches).toEqual(["https://www.youtube.com/*"]);
      expect(script.run_at).toBe("document_start");
      expect(script.all_frames).toBe(false);
    }
    expect(m.content_scripts[0].world).toBe("MAIN");
    expect(m.content_scripts[0].js).toEqual([
      "sites/youtube/theater-bridge.js",
    ]);
    expect(m.minimum_chrome_version).toBe("116");
  });
  it("keeps store name and description inside length limits", () => {
    const l = JSON.parse(readFileSync("src/_locales/en/messages.json", "utf8"));
    expect(l.extName.message.length).toBeLessThanOrEqual(75);
    expect(l.extDescription.message.length).toBeLessThanOrEqual(132);
  });
});
