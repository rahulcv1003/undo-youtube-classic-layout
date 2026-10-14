export type Layout = "new" | "classic" | "unknown";
export interface SignalResult {
  index: number;
  group: "newAll" | "newAny" | "classicAll" | "classicAny";
  matched: boolean;
}
export interface Status {
  page: "watch" | "other";
  layout: Layout;
  approach: "css" | "dom" | "none";
  signals: SignalResult[];
  dataVersion: string;
  active: boolean;
  paused: boolean;
  message: string;
  widthBucket: string;
}
export type Message =
  | { type: "getStatus" }
  | { type: "statusChanged"; status: Status }
  | { type: "restoredView" }
  | { type: "showComments" };
export function isStatus(x: unknown): x is Status {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return (
    ["watch", "other"].includes(s.page as string) &&
    ["new", "classic", "unknown"].includes(s.layout as string) &&
    ["css", "dom", "none"].includes(s.approach as string) &&
    typeof s.active === "boolean" &&
    typeof s.paused === "boolean" &&
    typeof s.message === "string" &&
    s.message.length <= 240 &&
    typeof s.dataVersion === "string" &&
    /^\d{4}-\d{2}-\d{2}\.\d+$/.test(s.dataVersion) &&
    typeof s.widthBucket === "string" &&
    [
      "under 1024",
      "1024 to 1919",
      "1920 to 2559",
      "2560 to 3439",
      "3440 and above",
    ].includes(s.widthBucket) &&
    Array.isArray(s.signals) &&
    s.signals.length <= 80 &&
    s.signals.every(
      (v) =>
        v &&
        typeof v === "object" &&
        Number.isInteger(v.index) &&
        v.index >= 0 &&
        v.index < 20 &&
        ["newAll", "newAny", "classicAll", "classicAny"].includes(v.group) &&
        typeof v.matched === "boolean",
    )
  );
}
export function widthBucket(width: number): string {
  return width < 1024
    ? "under 1024"
    : width < 1920
      ? "1024 to 1919"
      : width < 2560
        ? "1920 to 2559"
        : width < 3440
          ? "2560 to 3439"
          : "3440 and above";
}
