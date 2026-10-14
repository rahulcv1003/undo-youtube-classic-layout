export const features = [
  "restoreLayout",
  "hideAiSearch",
  "spoilerShield",
  "playerWidth",
] as const;
export type Feature = (typeof features)[number];
export interface SignalGroup {
  requireAll: string[];
  requireAny: string[];
}
export const containerKeys = [
  "columns",
  "flatten",
  "player",
  "metadata",
  "recommendations",
  "recommendationItems",
  "recommendationCard",
  "recommendationImage",
  "recommendationDetails",
  "commentsPanel",
  "descriptionPanel",
  "panelContent",
  "panelHeader",
  "otherPanels",
  "playlistPanel",
  "liveChat",
  "sideRail",
  "splitSpacer",
  "aiSearchEntry",
  "comments",
  "shieldHost",
  "secondaryHost",
  "belowHost",
] as const;
export type ContainerKey = (typeof containerKeys)[number];
export interface SelectorData {
  schemaVersion: 1;
  dataVersion: string;
  killSwitch: {
    site: boolean;
    features: Record<Feature, boolean>;
    message: string;
  };
  detection: {
    watchPageRoot: string;
    newLayoutSignals: SignalGroup;
    classicLayoutSignals: SignalGroup;
  };
  containers: Record<ContainerKey, string>;
  experimentFlags: { newLayout: string[] };
  navigationEvents: string[];
  restore: {
    rootAttributes: string[];
    metadataAttributes: string[];
    commentsVisibilityAttribute: string;
    commentsVisibilityValue: string;
  };
}
const record = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const exact = (x: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(x).length === keys.length &&
  keys.every((k) => Object.hasOwn(x, k));
// Deliberately narrow grammar. Rules come from bundled templates, never remote CSS.
// No escapes, URLs, declaration separators, comments, at-rules or pseudo-elements.
export function safeSelector(x: unknown): x is string {
  if (!(
    typeof x === "string" &&
    x.length > 0 &&
    x.length <= 1200 &&
    /^[a-zA-Z0-9_\-\s#.[\]="'():>,+*~|^$]+$/.test(x) &&
    !/javascript|expression|(?:^|\s)script(?:\s|$)|url\s*\(|::|\/|\\|[{};@`]/i.test(
      x,
    )
  ))
    return false;
  let quote = "",
    brackets = 0,
    parens = 0;
  for (const char of x) {
    if (quote) {
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "[") brackets++;
    if (char === "]" && --brackets < 0) return false;
    if (char === "(") parens++;
    if (char === ")" && --parens < 0) return false;
  }
  if (quote || brackets || parens) return false;
  if (
    Array.from(x.matchAll(/:([a-z-]+)/gi)).some(
      (m) =>
        ![
          "is",
          "has",
          "not",
          "scope",
          "first-child",
          "last-child",
          "nth-child",
        ].includes(m[1]!),
    )
  )
    return false;
  if (typeof document !== "undefined") {
    try {
      document.querySelector(x);
    } catch {
      return false;
    }
  }
  return true;
}
function selectors(x: unknown, min: number): x is string[] {
  return (
    Array.isArray(x) &&
    x.length >= min &&
    x.length <= 20 &&
    x.every(safeSelector)
  );
}
function group(x: unknown): x is SignalGroup {
  return (
    record(x) &&
    exact(x, ["requireAll", "requireAny"]) &&
    selectors(x.requireAll, 2) &&
    selectors(x.requireAny, 0)
  );
}
export function isSelectorData(x: unknown): x is SelectorData {
  if (
    !record(x) ||
    !exact(x, [
      "schemaVersion",
      "dataVersion",
      "killSwitch",
      "detection",
      "containers",
      "experimentFlags",
      "navigationEvents",
      "restore",
    ])
  )
    return false;
  if (
    x.schemaVersion !== 1 ||
    typeof x.dataVersion !== "string" ||
    !/^\d{4}-\d{2}-\d{2}\.\d{1,6}$/.test(x.dataVersion)
  )
    return false;
  const k = x.killSwitch,
    d = x.detection,
    c = x.containers,
    f = x.experimentFlags;
  if (
    !record(k) ||
    !exact(k, ["site", "features", "message"]) ||
    typeof k.site !== "boolean" ||
    typeof k.message !== "string" ||
    k.message.length > 240 ||
    /[<>]/.test(k.message) ||
    Array.from(k.message).some((char) => char.charCodeAt(0) < 32)
  )
    return false;
  if (
    !record(k.features) ||
    !exact(k.features, features) ||
    !Object.values(k.features).every((v) => typeof v === "boolean")
  )
    return false;
  if (
    !record(d) ||
    !exact(d, ["watchPageRoot", "newLayoutSignals", "classicLayoutSignals"]) ||
    !safeSelector(d.watchPageRoot) ||
    !group(d.newLayoutSignals) ||
    !group(d.classicLayoutSignals)
  )
    return false;
  if (
    !record(c) ||
    !exact(c, containerKeys) ||
    !Object.values(c).every(safeSelector)
  )
    return false;
  if (
    !record(f) ||
    !exact(f, ["newLayout"]) ||
    !Array.isArray(f.newLayout) ||
    f.newLayout.length > 20 ||
    !f.newLayout.every(
      (v) => typeof v === "string" && /^[a-z][a-z0-9_]{0,99}$/.test(v),
    )
  )
    return false;
  if (
    !record(x.restore) ||
    !exact(x.restore, [
      "rootAttributes",
      "metadataAttributes",
      "commentsVisibilityAttribute",
      "commentsVisibilityValue",
    ]) ||
    ![x.restore.rootAttributes, x.restore.metadataAttributes].every(
      (v) =>
        Array.isArray(v) &&
        v.length <= 12 &&
        v.every(
          (a) => typeof a === "string" && /^[a-z][a-z0-9_-]{0,79}$/.test(a),
        ),
    )
  )
    return false;
  if (
    x.restore.commentsVisibilityAttribute !== "visibility" ||
    x.restore.commentsVisibilityValue !== "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"
  )
    return false;
  return (
    Array.isArray(x.navigationEvents) &&
    x.navigationEvents.length > 0 &&
    x.navigationEvents.length <= 8 &&
    x.navigationEvents.every(
      (v) => typeof v === "string" && /^yt-[a-z-]{1,60}$/.test(v),
    )
  );
}
export function newerOrEqual(a: string, b: string): boolean {
  const [ad, an] = a.split("."),
    [bd, bn] = b.split(".");
  return ad! < bd! ? false : ad! > bd! || Number(an) >= Number(bn);
}
