import { config } from "../config";
import { readSettings, updateSettings } from "../core/settings";
import { isStatus, type Status } from "../core/messages";
import { shouldShowRating } from "../core/rating";
import { element, localize } from "./i18n";
localize();
element("version").textContent = chrome.runtime.getManifest().version;
const toggle = element<HTMLButtonElement>("enabled"),
  line = element("status");
let status: Status | null = null;
let enabled = true,
  tabId: number | undefined;
function render(): void {
  toggle.setAttribute("aria-checked", String(enabled));
  const key = !enabled
    ? "statusOff"
    : !status
      ? "statusUnavailable"
      : status.paused
        ? "statusPaused"
        : status.page === "other"
          ? "statusOther"
          : status.active
            ? "statusRestored"
            : status.layout === "classic"
              ? "statusClassic"
              : "statusUnknown";
  line.textContent =
    enabled && status?.paused && status.message
      ? status.message
      : chrome.i18n.getMessage(key);
  document.body.dataset.state =
    key === "statusRestored" || key === "statusClassic" ? "ready" : "idle";
}
async function loadStatus(): Promise<void> {
  try {
    const response: unknown =
      tabId === undefined
        ? null
        : await chrome.tabs.sendMessage(tabId, { type: "getStatus" });
    status = isStatus(response) ? response : null;
  } catch {
    status = null;
  }
  render();
}
toggle.addEventListener("click", () => {
  toggle.disabled = true;
  void updateSettings({ enabled: !enabled })
    .then(async (s) => {
      enabled = s.enabled;
      await loadStatus();
    })
    .catch(() => {
      line.textContent = chrome.i18n.getMessage("saveFailed");
    })
    .finally(() => {
      toggle.disabled = false;
    });
});
element("options").addEventListener("click", () => {
  void chrome.tabs.create({ url: chrome.runtime.getURL("ui/options.html") });
});
element("report").addEventListener("click", () => {
  const url = new URL(chrome.runtime.getURL("ui/report.html"));
  if (tabId !== undefined) url.searchParams.set("tab", String(tabId));
  void chrome.tabs.create({ url: url.href });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.settings)
    void readSettings().then((s) => {
      enabled = s.enabled;
      render();
    });
});
chrome.runtime.onMessage.addListener((message: unknown, sender) => {
  if (
    sender.id === chrome.runtime.id &&
    sender.tab?.id === tabId &&
    message &&
    typeof message === "object" &&
    "type" in message &&
    message.type === "statusChanged" &&
    "status" in message &&
    isStatus(message.status)
  ) {
    status = message.status;
    render();
  }
  return false;
});
void Promise.all([
  readSettings(),
  chrome.tabs.query({ active: true, currentWindow: true }),
  chrome.storage.local.get(["installedAt", "restoredViews", "ratingPrompt"]),
])
  .then(async ([s, tabs, local]) => {
    enabled = s.enabled;
    tabId = tabs[0]?.id;
    await loadStatus();
    toggle.disabled = false;
    if (config.storeUrl && shouldShowRating(local)) {
      element("rating").hidden = false;
      const rate = element<HTMLAnchorElement>("rate");
      rate.href = config.storeUrl;
      rate.target = "_blank";
      rate.rel = "noopener";
      rate.addEventListener("click", () => {
        void chrome.storage.local.set({ ratingPrompt: "clicked" });
        element("rating").hidden = true;
      });
      element("dismiss").addEventListener("click", () => {
        void chrome.storage.local.set({ ratingPrompt: "dismissed" });
        element("rating").hidden = true;
      });
    }
  })
  .catch(() => {
    line.textContent = chrome.i18n.getMessage("saveFailed");
  });
