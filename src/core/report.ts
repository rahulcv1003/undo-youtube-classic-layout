import type { Status } from "./messages";
export function browserInfo(userAgent: string): {
  browser: string;
  os: string;
} {
  const match = /(Edg|OPR|Chrome)\/([\d.]+)/.exec(userAgent);
  return {
    browser: match
      ? `${match[1] === "Edg" ? "Edge" : match[1] === "OPR" ? "Opera" : "Chromium"} ${match[2]}`
      : "Unknown browser",
    os: /Windows/.test(userAgent)
      ? "Windows"
      : /Macintosh/.test(userAgent)
        ? "macOS"
        : /Linux/.test(userAgent)
          ? "Linux"
          : "Other",
  };
}
export function reportDetails(
  version: string,
  userAgent: string,
  status: Status | null,
): string {
  const info = browserInfo(userAgent);
  return [
    `Extension: ${/^\d+(\.\d+){1,3}$/.test(version) ? version : "unknown"}`,
    `Browser: ${info.browser}`,
    `OS: ${info.os}`,
    `Window width: ${status?.widthBucket ?? "unavailable"}`,
    `Layout: ${status?.layout ?? "unavailable"}`,
    `Approach: ${status?.approach ?? "none"}`,
    `Selector data: ${status?.dataVersion ?? "unavailable"}`,
    `Signals: ${status?.signals.map((s) => `${s.group}[${s.index}]=${s.matched ? "matched" : "missing"}`).join(", ") || "unavailable"}`,
  ].join("\n");
}
export function reportLinks(
  details: string,
  reportUrl: string,
  email: string,
): { issue: string; email: string } {
  let issue = "";
  try {
    const url = new URL(reportUrl);
    if (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      /^\/[^/]+\/[^/]+\/issues\/new$/.test(url.pathname)
    ) {
      url.searchParams.set("template", "broken-layout.yml");
      url.searchParams.set("diagnostics", details);
      issue = url.href;
    }
  } catch {
    /* Development endpoints stay inert. */
  }
  return {
    issue,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
      ? `mailto:${email}?subject=${encodeURIComponent("Undo broken layout")}&body=${encodeURIComponent(details)}`
      : "",
  };
}
