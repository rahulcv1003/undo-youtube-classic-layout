import {
  migrateSettings,
  readSettings,
  type Settings,
} from "../../core/settings";
import {
  bundledSelectors,
  chooseSelectors,
  readSelectors,
} from "../../core/selectors-store";
import type { SelectorData } from "../../core/schema";
import { widthBucket, type Message, type Status } from "../../core/messages";
import { detect, isWatchPage } from "./detect";
import { buildCss } from "./restore.css";
import { NativeRestore } from "./relocate";
import { clearPlayerControls, ensureMiniplayerButton } from "./player-modes";

let settings: Settings = migrateSettings(null),
  data: SelectorData = bundledSelectors;
let ready = false,
  watchRoot: Element | null = null,
  observer: MutationObserver | null = null;
let debounce: ReturnType<typeof setTimeout> | undefined,
  bootstrap: MutationObserver | null = null;
let frame: number | undefined;
let pendingTimer: ReturnType<typeof setTimeout> | undefined;
let revealed = false,
  button: HTMLButtonElement | null = null,
  style: HTMLStyleElement | null = null;
let lastStatus = "",
  lastCountedVideo: string | null = null;
const restore = new NativeRestore();
let detected: ReturnType<typeof detect> | null = null;
let status: Status = {
  page: "other",
  layout: "unknown",
  approach: "none",
  signals: [],
  dataVersion: data.dataVersion,
  active: false,
  paused: false,
  message: "",
  widthBucket: widthBucket(innerWidth),
};
const html = () => document.documentElement;
const send = (message: Message) => {
  void chrome.runtime.sendMessage(message).catch(() => {
    /* Tab may outlive an extension update. */
  });
};
function clearAttributes(): void {
  clearPlayerControls();
  for (const name of [
    "data-undo-yt",
    "data-undo-yt-layout",
    "data-undo-yt-hide-ai",
    "data-undo-yt-shield",
    "data-undo-yt-width",
  ])
    html()?.removeAttribute(name);
  button?.remove();
  button = null;
}
function endPending(): void {
  html()?.removeAttribute("data-undo-yt-pending");
  clearTimeout(pendingTimer);
}
function publish(next: Status): void {
  status = next;
  const serialized = JSON.stringify(next);
  if (serialized !== lastStatus) {
    lastStatus = serialized;
    send({ type: "statusChanged", status });
  }
}
function ensureStyle(): void {
  if (!html()) return;
  if (!style?.isConnected) {
    style = document.createElement("style");
    style.id = "undo-layout-style";
    html().append(style);
  }
  const css = buildCss(data);
  if (style.textContent !== css) style.textContent = css;
}
function startPending(): void {
  if (
    !settings.enabled ||
    data.killSwitch.site ||
    data.killSwitch.features.restoreLayout ||
    restore.valid(watchRoot) ||
    !isWatchPage(new URL(location.href))
  )
    return;
  html()?.setAttribute("data-undo-yt-pending", "");
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(endPending, 300);
}
function apply(): void {
  if (!html() || !ready) return;
  const page = isWatchPage(new URL(location.href)) ? "watch" : "other";
  if (page === "other") {
    observer?.disconnect();
    observer = null;
    restore.undo();
    detected = null;
    watchRoot = null;
    bootstrap?.disconnect();
    bootstrap = null;
    clearTimeout(debounce);
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    debounce = undefined;
    clearAttributes();
    endPending();
    lastCountedVideo = null;
    publish({
      page,
      layout: "unknown",
      signals: [],
      approach: "none",
      active: false,
      paused: false,
      message: "",
      dataVersion: data.dataVersion,
      widthBucket: widthBucket(innerWidth),
    });
    return;
  }
  const root = document.querySelector(data.detection.watchPageRoot);
  observer?.disconnect();
  if (root !== watchRoot) {
    restore.undo();
    detected = null;
    watchRoot = root;
    if (root) {
      bootstrap?.disconnect();
      bootstrap = null;
      observer = new MutationObserver(schedule);
    }
  }
  if (!root && !bootstrap) {
    // Watch-only startup discovery stays available on slow loads. It ends as
    // soon as a root appears, or immediately when navigation leaves /watch.
    bootstrap = new MutationObserver(() => {
      if (
        !isWatchPage(new URL(location.href)) ||
        document.querySelector(data.detection.watchPageRoot)
      ) {
        bootstrap?.disconnect();
        bootstrap = null;
        apply();
      }
    });
    bootstrap.observe(document.body ?? html()!, {
      childList: true,
      subtree: true,
    });
  }
  const paused = data.killSwitch.site || data.killSwitch.features.restoreLayout;
  if (!restore.valid(root)) {
    restore.undo();
    detected = detect(document, data);
  }
  const result = detected ?? detect(document, data);
  let active =
    settings.enabled &&
    !paused &&
    result.layout === "new" &&
    !!root &&
    !root.hasAttribute("hidden");
  if (active) active = restore.apply(root!, data);
  else restore.undo();
  if (!active) clearAttributes();
  ensureStyle();
  if (active) {
    ensureMiniplayerButton(root!);
    html()!.setAttribute("data-undo-yt", "on");
    html()!.setAttribute("data-undo-yt-layout", "new");
    html()!.toggleAttribute(
      "data-undo-yt-hide-ai",
      settings.hideAiSearch && !data.killSwitch.features.hideAiSearch,
    );
    if (!data.killSwitch.features.playerWidth)
      html()!.setAttribute("data-undo-yt-width", settings.playerWidth);
    else html()!.removeAttribute("data-undo-yt-width");
    if (
      settings.spoilerShield &&
      !revealed &&
      !data.killSwitch.features.spoilerShield
    ) {
      html()!.setAttribute("data-undo-yt-shield", "");
      const comments = root!.querySelector(data.containers.comments);
      if (comments && !button?.isConnected) {
        button = document.createElement("button");
        button.id = "undo-show-comments";
        button.type = "button";
        button.textContent = chrome.i18n.getMessage("showComments");
        button.addEventListener("click", () => {
          send({ type: "showComments" });
          revealed = true;
          apply();
        });
        comments.before(button);
      }
    } else {
      html()!.removeAttribute("data-undo-yt-shield");
      button?.remove();
      button = null;
    }
    const video = new URL(location.href).searchParams.get("v");
    if (video && lastCountedVideo !== video) {
      lastCountedVideo = video;
      send({ type: "restoredView" });
    }
  }
  publish({
    page,
    ...result,
    approach: active ? "dom" : "none",
    active,
    paused,
    message: data.killSwitch.message,
    dataVersion: data.dataVersion,
    widthBucket: widthBucket(innerWidth),
  });
  if (root) {
    observer?.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "hidden",
        "theater",
        "fullscreen",
        "video-id",
        "visibility",
        ...data.restore.rootAttributes,
        ...data.restore.metadataAttributes,
      ],
    });
    // Root replacement is a sibling mutation, invisible to an observer on the
    // old root. Observe only its parent's immediate children as well.
    if (root.parentElement)
      observer?.observe(root.parentElement, { childList: true });
  }
  if (result.layout !== "unknown" || !settings.enabled || paused) endPending();
}
function schedule(): void {
  if (debounce !== undefined || frame !== undefined) return;
  const run = () => {
    clearTimeout(debounce);
    if (frame !== undefined) cancelAnimationFrame(frame);
    debounce = undefined;
    frame = undefined;
    apply();
  };
  // Coalesce before the next paint, without a trailing debounce that can be
  // postponed forever. The timeout also covers background tabs with paused rAF.
  frame = requestAnimationFrame(run);
  debounce = setTimeout(run, 32);
}
const events = new Set<string>();
function attachEvents(): void {
  for (const event of data.navigationEvents)
    if (!events.has(event)) {
      events.add(event);
      document.addEventListener(event, () => {
        startPending();
        apply();
      });
    }
}
chrome.runtime.onMessage.addListener((message: Message, _sender, respond) => {
  if (message?.type === "getStatus") {
    respond(status);
  }
  return false;
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.settings) {
    settings = migrateSettings(changes.settings.newValue);
    rememberEnabled();
    apply();
  }
  if (area === "local" && changes.selectorCache) {
    observer?.disconnect();
    restore.undo();
    detected = null;
    data = chooseSelectors(changes.selectorCache.newValue);
    attachEvents();
    apply();
  }
  if (area === "session" && changes.commentsRevealed) {
    revealed = changes.commentsRevealed.newValue === true;
    apply();
  }
});
document.addEventListener("yt-navigate-start", () => {
  // Keep a verified restoration through watch-to-watch navigation. Undoing it
  // here exposes the new layout while YouTube is fetching the next video.
  schedule();
});
addEventListener("popstate", () => {
  startPending();
  apply();
});
addEventListener("resize", schedule);
addEventListener("pagehide", () => {
  observer?.disconnect();
  bootstrap?.disconnect();
  clearTimeout(debounce);
  if (frame !== undefined) cancelAnimationFrame(frame);
  frame = undefined;
  debounce = undefined;
  endPending();
});
addEventListener("pageshow", apply);
// Install the bounded first-paint guard before asynchronous storage reads.
// This boolean hint never authorises restoration; synced settings still do.
try {
  if (sessionStorage.getItem("undo-enabled-hint") === "off")
    settings.enabled = false;
} catch {
  /* Site storage can be disabled. */
}
function rememberEnabled(): void {
  try {
    sessionStorage.setItem(
      "undo-enabled-hint",
      settings.enabled ? "on" : "off",
    );
  } catch {
    /* Optional startup hint only. */
  }
}
ensureStyle();
startPending();
// A single document_start bundle avoids duplicate libraries and async ordering races
// between early/idle scripts. Layout restoration stays isolated; the separate
// small MAIN-world bridge only handles native theater-mode controls.
void Promise.all([
  readSettings(),
  readSelectors(),
  chrome.storage.session
    .get("commentsRevealed")
    .catch(() => ({ commentsRevealed: false })),
])
  .then(([s, d, session]) => {
    settings = s;
    rememberEnabled();
    data = d;
    revealed = session.commentsRevealed === true;
    ready = true;
    attachEvents();
    if (html()) {
      ensureStyle();
      apply();
    } else
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          ensureStyle();
          apply();
        },
        { once: true },
      );
  })
  .catch(() => {
    settings = { ...settings, enabled: false };
    ready = true;
    apply();
  });
document.addEventListener("DOMContentLoaded", apply, { once: true });
