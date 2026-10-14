import type { SelectorData, SignalGroup } from "../../core/schema";
import type { Layout, SignalResult } from "../../core/messages";
export function isWatchPage(url: URL): boolean {
  return (
    url.protocol === "https:" &&
    url.hostname === "www.youtube.com" &&
    url.pathname === "/watch"
  );
}
export function detect(
  doc: Document,
  data: SelectorData,
): { layout: Layout; signals: SignalResult[] } {
  const signals: SignalResult[] = [];
  const match = (selector: string): boolean => {
    try {
      return !!doc.querySelector(selector);
    } catch {
      return false;
    }
  };
  const group = (g: SignalGroup, prefix: "new" | "classic") => {
    const all = g.requireAll.map((s, index) => {
      const matched = match(s);
      signals.push({ group: `${prefix}All`, index, matched });
      return matched;
    });
    const any = g.requireAny.map((s, index) => {
      const matched = match(s);
      signals.push({ group: `${prefix}Any`, index, matched });
      return matched;
    });
    return all.every(Boolean) && (any.length === 0 || any.some(Boolean));
  };
  const n = group(data.detection.newLayoutSignals, "new"),
    c = group(data.detection.classicLayoutSignals, "classic");
  return { layout: n !== c ? (n ? "new" : "classic") : "unknown", signals };
}
