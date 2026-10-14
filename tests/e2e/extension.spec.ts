import {
  test,
  expect,
  chromium,
  type BrowserContext,
  type Worker,
  type Page,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdtemp, readFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { defaults } from "../../src/core/settings";
import { bundledSelectors } from "../../src/core/selectors-store";
let context: BrowserContext, worker: Worker, extensionId: string;
const source = await readFile(
  "tests/fixtures/youtube/2026-10-14-new-normal.html",
  "utf8",
);
const classic = await readFile(
  "tests/fixtures/youtube/2026-10-14-classic-normal.html",
  "utf8",
);
const errors: string[] = [];
async function settings(patch: Record<string, unknown> = {}): Promise<void> {
  await worker.evaluate(
    async (value) => {
      await chrome.storage.sync.set({ settings: value });
    },
    { ...defaults, ...patch },
  );
}
async function cache(data: unknown): Promise<void> {
  await worker.evaluate(async (value) => {
    await chrome.storage.local.set({
      selectorCache: { fetchedAt: Date.now(), data: value },
    });
  }, data);
}
async function watch(video = "test"): Promise<Page> {
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`https://www.youtube.com/watch?v=${video}`);
  return page;
}
test.beforeAll(async () => {
  const profile = await mkdtemp(join(tmpdir(), "undo-test-"));
  context = await chromium.launchPersistentContext(profile, {
    channel: "chromium",
    ...(process.env.UNDO_TEST_CHROMIUM
      ? { executablePath: process.env.UNDO_TEST_CHROMIUM }
      : {}),
    headless: true,
    args: [
      `--disable-extensions-except=${resolve("dist")}`,
      `--load-extension=${resolve("dist")}`,
    ],
  });
  await context.route("https://www.youtube.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: route.request().url().includes("classic")
        ? classic
        : route.request().url().includes("unknown")
          ? "<html><body><main>Unknown page</main></body></html>"
          : source,
    }),
  );
  worker =
    context.serviceWorkers()[0] ??
    (await context.waitForEvent("serviceworker"));
  extensionId = new URL(worker.url()).host;
  await expect
    .poll(() =>
      worker.evaluate(
        async () =>
          !!(await chrome.storage.local.get("installedAt")).installedAt,
      ),
    )
    .toBe(true);
  await mkdir("docs/screenshots", { recursive: true });
});
test.afterAll(async () => {
  await context?.close();
});
test.beforeEach(async () => {
  await settings();
  await worker.evaluate(async () => {
    await chrome.storage.local.remove("selectorCache");
    await chrome.storage.session.remove("commentsRevealed");
  });
});
test.afterEach(async () => {
  expect(errors.splice(0)).toEqual([]);
  for (const page of context.pages()) await page.close();
});
test("native theater bridge and nested miniplayer controls survive layout restoration", async () => {
  const page = await watch("modes");
  await expect(page.locator("html")).toHaveAttribute("data-undo-yt", "on");
  await page.evaluate(() => {
    const root = document.querySelector("ytd-watch-flexy")! as HTMLElement & {
      theater: boolean;
      onTheaterReduxValueUpdate: (enabled: boolean) => void;
      updateFullBleedElementLocations: () => void;
      schedulePlayerSizeUpdate_: () => void;
      player: { setSizeStyle: () => void };
    };
    const player = document.createElement("div");
    player.id = "movie_player";
    player.tabIndex = 0;
    const controls = document.createElement("div");
    controls.className = "ytp-right-controls";
    const nested = document.createElement("div");
    const size = document.createElement("button");
    size.className = "ytp-size-button";
    size.textContent = "Theater";
    nested.append(size);
    controls.append(nested);
    player.append(controls);
    root.querySelector("#player")!.append(player);
    root.theater = false;
    root.onTheaterReduxValueUpdate = (enabled) => {
      root.theater = enabled;
      root.toggleAttribute("theater", enabled);
    };
    root.updateFullBleedElementLocations = () => {
      const host = root.querySelector(
        root.theater ? "#player-full-bleed-container" : "#player",
      )!;
      host.append(player);
    };
    root.schedulePlayerSizeUpdate_ = () => {};
    root.player = { setSizeStyle: () => {} };
    player.addEventListener("keydown", (event) => {
      if (event.key === "i") player.setAttribute("data-native-mini", "true");
    });
  });
  const mini = page.getByRole("button", {
    name: "Miniplayer (i)",
    exact: true,
  });
  await expect(mini).toBeVisible();
  await page.locator(".ytp-size-button").click();
  await expect(page.locator("ytd-watch-flexy")).toHaveAttribute("theater", "");
  await expect(
    page.locator("#player-full-bleed-container #movie_player"),
  ).toHaveCount(1);
  await page.locator("#movie_player").press("t");
  await expect(page.locator("ytd-watch-flexy")).not.toHaveAttribute(
    "theater",
    "",
  );
  await expect(page.locator("#player #movie_player")).toHaveCount(1);
  await mini.click();
  await expect(page.locator("#movie_player")).toHaveAttribute(
    "data-native-mini",
    "true",
  );
  await settings({ enabled: false });
  await expect(mini).toHaveCount(0);
  await page.locator(".ytp-size-button").click();
  await expect(page.locator("ytd-watch-flexy")).not.toHaveAttribute(
    "theater",
    "",
  );
});

test("restores original nodes and toggles every open video without reload", async () => {
  const a = await watch("a"),
    b = await watch("b");
  for (const p of [a, b])
    await expect(p.locator("html")).toHaveAttribute(
      "data-undo-yt-layout",
      "new",
    );
  await a.evaluate(() => {
    document
      .querySelector("#secondary-inner > #related")!
      .setAttribute("data-test-original", "yes");
  });
  await settings({ enabled: false });
  for (const p of [a, b]) {
    await expect(p.locator("html")).not.toHaveAttribute("data-undo-yt");
    await expect(p.locator("ytd-watch-flexy")).toHaveAttribute(
      "fixed-default-panels",
      "",
    );
    await expect(
      p.locator(
        "#primary #related:has(>ytd-watch-next-secondary-results-renderer)",
      ),
    ).toHaveCount(1);
  }
  await settings();
  await expect(a.locator("#secondary-inner > #related")).toHaveAttribute(
    "data-test-original",
    "yes",
  );
});
test("classic and unknown pages receive no restoration changes", async () => {
  const p = await watch("classic");
  await expect(p.locator("html")).not.toHaveAttribute("data-undo-yt");
  await expect(p.locator("#secondary-inner > #related")).toHaveCount(1);
  await p.goto("https://www.youtube.com/watch?v=unknown");
  await expect(p.locator("html")).not.toHaveAttribute("data-undo-yt");
});
test("spoiler shield reveals once for the browser session, including other tabs", async () => {
  await settings({ spoilerShield: true });
  const a = await watch("shield-a"),
    b = await watch("shield-b");
  await expect(a.getByRole("button", { name: "Show comments" })).toBeVisible();
  await expect(a.locator("ytd-comments#comments")).toBeHidden();
  await a.getByRole("button", { name: "Show comments" }).click();
  await expect(a.locator("ytd-comments#comments")).toBeVisible();
  await expect(b.getByRole("button", { name: "Show comments" })).toHaveCount(0);
  await b.goto("https://www.youtube.com/watch?v=shield-next");
  await expect(b.getByRole("button", { name: "Show comments" })).toHaveCount(0);
});
test("whole-site and feature kill switches apply live, malformed cache falls back", async () => {
  const p = await watch();
  await expect(p.locator("html")).toHaveAttribute("data-undo-yt", "on");
  const data = structuredClone(bundledSelectors);
  data.killSwitch.site = true;
  data.killSwitch.message = "Layout fix in progress";
  await cache(data);
  await expect(p.locator("html")).not.toHaveAttribute("data-undo-yt");
  await cache({ ...data, schemaVersion: 99 });
  await expect(p.locator("html")).toHaveAttribute("data-undo-yt", "on");
  await settings({ hideAiSearch: true });
  data.killSwitch.site = false;
  data.killSwitch.features.hideAiSearch = true;
  await cache(data);
  await expect(p.locator("html")).not.toHaveAttribute("data-undo-yt-hide-ai");
});
test("YouTube SPA navigation cleans up and restores on return", async () => {
  const p = await watch();
  await expect(p.locator("html")).toHaveAttribute("data-undo-yt", "on");
  await p.evaluate(() => {
    document.dispatchEvent(new Event("yt-navigate-start"));
    history.pushState({}, "", "/");
    document.dispatchEvent(new Event("yt-navigate-finish"));
  });
  await expect(p.locator("html")).not.toHaveAttribute("data-undo-yt");
  await expect(
    p.locator(
      "#primary #related:has(>ytd-watch-next-secondary-results-renderer)",
    ),
  ).toHaveCount(1);
  await p.evaluate(() => {
    history.pushState({}, "", "/watch?v=back");
    document.dispatchEvent(new Event("yt-navigate-finish"));
  });
  await expect(p.locator("html")).toHaveAttribute("data-undo-yt", "on");
});
test("repeated refreshes restore reliably and never leave a pending page hidden", async () => {
  const p = await watch("refresh");
  for (let n = 0; n < 12; n++) {
    if (n) await p.reload();
    await expect(p.locator("#secondary-inner > #related")).toHaveCount(1);
    await expect(p.locator("html")).not.toHaveAttribute("data-undo-yt-pending");
    await expect(p.locator("ytd-watch-flexy")).not.toHaveAttribute(
      "fixed-default-panels",
    );
  }
});
test("watch-to-watch transitions keep restoration and repair reparented nodes during continuous updates", async () => {
  const p = await watch("navigation");
  await expect(p.locator("#secondary-inner > #related")).toHaveCount(1);
  await p.evaluate(() => {
    document.dispatchEvent(new Event("yt-navigate-start"));
    if (!document.documentElement.hasAttribute("data-undo-yt"))
      throw Error("Navigation exposed the un-restored layout");
    const root = document.querySelector("ytd-watch-flexy")!;
    const rec = root.querySelector("#secondary-inner > #related")!;
    root.querySelector("#below > div:last-child")!.append(rec);
    root.setAttribute("fixed-default-panels", "");
    history.pushState({}, "", "/watch?v=next-video");
    document.dispatchEvent(new Event("yt-navigate-finish"));
  });
  await expect(p.locator("#secondary-inner > #related")).toHaveCount(1);
  // Keep mutations arriving faster than the old 100 ms trailing debounce.
  const latency = await p.evaluate(async () => {
    const root = document.querySelector("ytd-watch-flexy")!,
      rec = root.querySelector("#secondary-inner > #related")!;
    root.querySelector("#below > div:last-child")!.append(rec);
    const started = performance.now();
    return await new Promise<number>((resolve, reject) => {
      const observer = new MutationObserver(() => {
        if (rec.parentElement?.id === "secondary-inner") {
          observer.disconnect();
          clearTimeout(limit);
          resolve(performance.now() - started);
        }
      });
      observer.observe(root, { subtree: true, childList: true });
      const limit = setTimeout(() => {
        observer.disconnect();
        reject(Error("Restore starved during continuous updates"));
      }, 800);
      let count = 0;
      const churn = () => {
        root.querySelector("#alerts")!.textContent = String(count++);
        if (count < 50) setTimeout(churn, 10);
      };
      churn();
    });
  });
  expect(latency).toBeLessThan(250);
});
test("replacing the entire watch root is repaired even without a navigation event", async () => {
  const p = await watch("root-replacement");
  await expect(p.locator("#secondary-inner > #related")).toHaveCount(1);
  await p.evaluate((html) => {
    const replacement = new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("ytd-watch-flexy")!;
    document
      .querySelector("ytd-watch-flexy")!
      .replaceWith(document.adoptNode(replacement));
  }, source);
  await expect(p.locator("#secondary-inner > #related")).toHaveCount(1);
  await expect(p.locator("ytd-watch-flexy")).not.toHaveAttribute(
    "fixed-default-panels",
  );
});
test("a slow watch root appearing after the old five-second cutoff is still restored", async () => {
  const p = await watch("unknown-late-root");
  await p.waitForTimeout(5200);
  await p.evaluate((html) => {
    const root = new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("ytd-watch-flexy")!;
    document.body.append(document.adoptNode(root));
  }, source);
  await expect(p.locator("#secondary-inner > #related")).toHaveCount(1);
});
test("late comment subtree replacement is repaired without duplicate controls", async () => {
  await settings({ spoilerShield: true });
  const p = await watch();
  await expect(p.locator("#undo-show-comments")).toHaveCount(1);
  await p.evaluate(() => {
    const c = document.querySelector("ytd-comments#comments")!;
    const replacement = document.createElement("ytd-comments");
    replacement.id = "comments";
    replacement.setAttribute("hidden", "");
    c.replaceWith(replacement);
  });
  await expect(p.locator("ytd-comments#comments")).not.toHaveAttribute(
    "hidden",
  );
  await expect(p.locator("#undo-show-comments")).toHaveCount(1);
});
test("options save live and become disabled when the master switch is off", async () => {
  const p = await context.newPage();
  await p.goto(`chrome-extension://${extensionId}/ui/options.html`);
  await p.getByLabel("Hide YouTube's AI features", { exact: true }).check();
  await expect
    .poll(() =>
      worker.evaluate(
        async () =>
          (
            (await chrome.storage.sync.get("settings")).settings as {
              hideAiSearch: boolean;
            }
          ).hideAiSearch,
      ),
    )
    .toBe(true);
  await settings({ enabled: false });
  await expect(p.locator("#hideAiSearch")).toBeDisabled();
  await expect(p.locator("#playerWidth")).toBeDisabled();
});
test("AI hiding leaves normal search alone and width caps apply only above 1920", async () => {
  await settings({ hideAiSearch: true, playerWidth: "cap" });
  const p = await watch();
  await expect(
    p.getByRole("button", { name: "Ask", exact: true }),
  ).toBeHidden();
  await expect(p.getByLabel("Normal search")).toBeVisible();
  await p.setViewportSize({ width: 1920, height: 900 });
  await expect
    .poll(() =>
      p.locator("#columns").evaluate((e) => getComputedStyle(e).maxWidth),
    )
    .toBe("none");
  await p.setViewportSize({ width: 2560, height: 900 });
  await expect
    .poll(() =>
      p.locator("#columns").evaluate((e) => getComputedStyle(e).maxWidth),
    )
    .toBe("1740px");
});
test("diagnostics preview includes no URL, title, video id or account data", async () => {
  const p = await watch("private-video-id");
  await expect(p.locator("html")).toHaveAttribute("data-undo-yt", "on");
  // Without the tabs permission, the worker can still obtain IDs through query.
  const tabId = await worker.evaluate(async () => {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        const s = await chrome.tabs.sendMessage(tab.id, { type: "getStatus" });
        if (s.page === "watch") return tab.id;
      } catch {
        /* extension pages */
      }
    }
    return null;
  });
  const report = await context.newPage();
  await report.goto(
    `chrome-extension://${extensionId}/ui/report.html?tab=${tabId}`,
  );
  await expect(report.locator("#details")).toHaveValue(/Approach: dom/);
  const text = await report.locator("#details").inputValue();
  expect(text).not.toMatch(/private-video-id|youtube.com|account|cookie/);
  await expect(report.locator("#unconfigured")).toBeHidden();
  await expect(report.locator("#issue")).toBeVisible();
  const issueUrl = new URL(
    (await report.locator("#issue").getAttribute("href"))!,
  );
  expect(issueUrl.origin).toBe("https://github.com");
  expect(issueUrl.pathname).toBe(
    "/rahulcv1003/undo-youtube-classic-layout/issues/new",
  );
  expect(issueUrl.searchParams.get("template")).toBe("broken-layout.yml");
  expect(issueUrl.searchParams.get("diagnostics")).toBe(text);
  expect(issueUrl.href).not.toMatch(/private-video-id|youtube\.com|cookie/);
});
test("popup reports every page state with a working live switch", async () => {
  for (const theme of ["light", "dark"] as const)
    for (const state of [
      "new",
      "classic",
      "unknown",
      "other",
      "off",
      "unavailable",
    ] as const) {
      await settings({ enabled: state !== "off" });
      const video =
        state === "unavailable"
          ? await context.newPage()
          : await watch(state === "off" ? "new" : state);
      if (state === "other") await video.goto("https://www.youtube.com/");
      const target = await worker.evaluate(async (pageState) => {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          if (!tab.id) continue;
          try {
            const s = await chrome.tabs.sendMessage(tab.id, {
              type: "getStatus",
            });
            if (
              (pageState === "other" && s.page === "other") ||
              (pageState !== "other" && s.page === "watch")
            )
              return tab.id;
          } catch {
            /* unrelated page */
          }
        }
        return -1;
      }, state);
      const popup = await context.newPage();
      await popup.emulateMedia({ colorScheme: theme });
      await popup.setViewportSize({ width: 320, height: 800 });
      // Only the isolated popup test page overrides active-tab lookup; production
      // code still queries the real active tab when opened as a toolbar popup.
      await popup.addInitScript(
        (id) => {
          chrome.tabs.query = async () => [{ id }] as chrome.tabs.Tab[];
        },
        state === "unavailable" ? -1 : target,
      );
      await popup.goto(`chrome-extension://${extensionId}/ui/popup.html`);
      const expected = {
        new: "This page had the new layout. Classic layout restored.",
        classic:
          "This page already uses the classic layout. Nothing to change.",
        unknown:
          "YouTube changed something we don't recognise yet. Nothing was changed on this page.",
        other: "Open a YouTube video to use this.",
        off: "Classic layout is off. YouTube is showing its own layout.",
        unavailable:
          "This works on YouTube video pages. If a video is already open, reload it once.",
      }[state];
      await expect(popup.locator("#status")).toHaveText(expected);
      await expect(popup.locator("#enabled")).toHaveAttribute(
        "aria-checked",
        String(state !== "off"),
      );
      if (state === "new") {
        await popup.locator("#enabled").click();
        await expect(popup.locator("#status")).toHaveText(
          "Classic layout is off. YouTube is showing its own layout.",
        );
        await popup.locator("#enabled").click();
        await expect(popup.locator("#status")).toHaveText(
          "This page had the new layout. Classic layout restored.",
        );
      }
      if (state === "off") {
        await popup.locator("#enabled").click();
        await expect(popup.locator("#status")).toHaveText(
          "This page had the new layout. Classic layout restored.",
        );
        await popup.locator("#enabled").click();
        await expect(popup.locator("#status")).toHaveText(expected);
      }
      await popup
        .locator("main")
        .screenshot({ path: `docs/screenshots/popup-${state}-${theme}.png` });
      await popup.close();
      await video.close();
    }
});
test("extension pages pass serious/critical accessibility checks in both themes", async () => {
  for (const theme of ["light", "dark"] as const)
    for (const name of ["popup", "options", "welcome", "report"]) {
      const p = await context.newPage();
      await p.emulateMedia({ colorScheme: theme });
      await p.setViewportSize({
        width: name === "popup" ? 320 : 1280,
        height: 900,
      });
      await p.goto(`chrome-extension://${extensionId}/ui/${name}.html`);
      await expect(p.locator("body")).not.toHaveText("");
      const results = await new AxeBuilder({ page: p }).analyze();
      expect(
        results.violations.filter(
          (v) => v.impact === "serious" || v.impact === "critical",
        ),
      ).toEqual([]);
      if (name === "popup")
        await p
          .locator("main")
          .screenshot({ path: `docs/screenshots/${name}-${theme}.png` });
      else
        await p.screenshot({
          path: `docs/screenshots/${name}-${theme}.png`,
          fullPage: true,
        });
      if (name === "welcome") {
        await p.setViewportSize({ width: 390, height: 844 });
        await p.screenshot({
          path: `docs/screenshots/welcome-${theme}-390.png`,
          fullPage: true,
        });
      }
      await p.close();
    }
});
