import { config } from "../config";
import { reportDetails, reportLinks } from "../core/report";
import { isStatus, type Status } from "../core/messages";
import { element, localize } from "./i18n";
localize();
element("details").setAttribute(
  "aria-label",
  chrome.i18n.getMessage("reportTitle"),
);
void (async () => {
  let status: Status | null = null;
  const tab = new URL(location.href).searchParams.get("tab");
  if (tab && /^\d+$/.test(tab)) {
    try {
      const response: unknown = await chrome.tabs.sendMessage(Number(tab), {
        type: "getStatus",
      });
      if (isStatus(response)) status = response;
    } catch {
      /* Original tab may have closed. */
    }
  }
  const details = reportDetails(
    chrome.runtime.getManifest().version,
    navigator.userAgent,
    status,
  );
  const box = element<HTMLTextAreaElement>("details");
  box.value = details;
  const links = reportLinks(details, config.reportUrl, config.supportEmail);
  for (const [key, href] of Object.entries(links)) {
    const link = element<HTMLAnchorElement>(key);
    link.hidden = !href;
    if (href) {
      link.href = href;
      link.rel = "noopener";
    }
  }
  element("unconfigured").hidden = !!links.issue || !!links.email;
  element("copy").addEventListener("click", () => {
    box.select();
    try {
      const copied = document.execCommand("copy");
      element("result").textContent = chrome.i18n.getMessage(
        copied ? "copied" : "copyFailed",
      );
    } catch {
      element("result").textContent = chrome.i18n.getMessage("copyFailed");
    }
  });
})();
