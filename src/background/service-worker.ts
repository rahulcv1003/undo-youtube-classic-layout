import { config } from "../config";
import {
  migrateSettings,
  readSettings,
  updateSettings,
} from "../core/settings";
import {
  fetchSelectors,
  readSelectors,
  SIX_HOURS,
} from "../core/selectors-store";
import { isStatus, type Status } from "../core/messages";
const statuses = new Map<number, Status>();
let refreshInFlight: Promise<void> | null = null;
let counterQueue = Promise.resolve();
async function icon(tabId?: number): Promise<void> {
  const enabled = (await readSettings()).enabled;
  const active =
    enabled && tabId !== undefined && statuses.get(tabId)?.active === true;
  const suffix = active ? "" : "-off";
  await chrome.action
    .setIcon({
      ...(tabId === undefined ? {} : { tabId }),
      path: {
        16: `assets/icons/16${suffix}.png`,
        32: `assets/icons/32${suffix}.png`,
      },
    })
    .catch(() => {});
}
async function refresh(startup = false): Promise<void> {
  if (!config.selectorUrl) return;
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const { selectorLastAttempt } = await chrome.storage.local.get(
      "selectorLastAttempt",
    );
    if (
      !startup &&
      typeof selectorLastAttempt === "number" &&
      Date.now() - selectorLastAttempt < SIX_HOURS
    )
      return;
    await chrome.storage.local.set({ selectorLastAttempt: Date.now() });
    const data = await fetchSelectors(
      config.selectorUrl,
      await readSelectors(),
    );
    if (data)
      await chrome.storage.local.set({
        selectorCache: { fetchedAt: Date.now(), data },
      });
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}
async function init(): Promise<void> {
  const { settings } = await chrome.storage.sync.get("settings");
  await chrome.storage.sync.set({ settings: migrateSettings(settings) });
  const state = await chrome.storage.local.get([
    "installedAt",
    "restoredViews",
    "ratingPrompt",
  ]);
  await chrome.storage.local.set({
    installedAt:
      typeof state.installedAt === "number" ? state.installedAt : Date.now(),
    restoredViews:
      typeof state.restoredViews === "number" &&
      Number.isSafeInteger(state.restoredViews) &&
      state.restoredViews >= 0
        ? state.restoredViews
        : 0,
    ratingPrompt:
      typeof state.ratingPrompt === "string" &&
      ["pending", "clicked", "dismissed"].includes(state.ratingPrompt)
        ? state.ratingPrompt
        : "pending",
  });
  // Only the boolean session preference is exposed to content scripts, never history.
  await chrome.storage.session.setAccessLevel({
    accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
  });
  if (!(await chrome.alarms.get("selector-refresh")))
    await chrome.alarms.create("selector-refresh", { periodInMinutes: 360 });
  if (config.uninstallUrl)
    await chrome.runtime.setUninstallURL(config.uninstallUrl);
  await icon();
}
chrome.runtime.onInstalled.addListener((details) => {
  void init().then(async () => {
    if (details.reason === "install")
      await chrome.tabs.create({
        url: chrome.runtime.getURL("ui/welcome.html"),
      });
    await refresh();
  });
});
chrome.runtime.onStartup.addListener(() => {
  void init().then(() => refresh(true));
});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "selector-refresh") void refresh();
});
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-classic-layout")
    void readSettings().then((s) => updateSettings({ enabled: !s.enabled }));
});
chrome.tabs.onRemoved.addListener((tabId) => {
  statuses.delete(tabId);
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.settings) {
    void icon();
    for (const tab of statuses.keys()) void icon(tab);
  }
});
chrome.runtime.onMessage.addListener((message: unknown, sender) => {
  if (sender.id !== chrome.runtime.id || !sender.tab?.id || !sender.url)
    return false;
  const url = new URL(sender.url);
  if (url.origin !== "https://www.youtube.com" || sender.frameId !== 0)
    return false;
  if (!message || typeof message !== "object" || !("type" in message))
    return false;
  const tabId = sender.tab.id;
  if (
    message.type === "statusChanged" &&
    "status" in message &&
    isStatus(message.status)
  ) {
    statuses.set(tabId, message.status);
    void icon(tabId);
  }
  if (message.type === "restoredView" && url.pathname === "/watch") {
    // Serialise increments from simultaneously restored tabs.
    counterQueue = counterQueue
      .then(async () => {
        const { restoredViews } =
          await chrome.storage.local.get("restoredViews");
        await chrome.storage.local.set({
          restoredViews: Math.min(
            Number.MAX_SAFE_INTEGER,
            (typeof restoredViews === "number" &&
            Number.isSafeInteger(restoredViews) &&
            restoredViews >= 0
              ? restoredViews
              : 0) + 1,
          ),
        });
      })
      .catch(() => {});
  }
  if (message.type === "showComments")
    void chrome.storage.session.set({ commentsRevealed: true });
  return false;
});
