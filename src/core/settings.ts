export interface Settings {
  schema: 1;
  enabled: boolean;
  hideAiSearch: boolean;
  spoilerShield: boolean;
  playerWidth: "default" | "fill" | "cap";
}
export const defaults: Readonly<Settings> = Object.freeze({
  schema: 1,
  enabled: true,
  hideAiSearch: false,
  spoilerShield: false,
  playerWidth: "default",
});
export function migrateSettings(input: unknown): Settings {
  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  return {
    schema: 1,
    enabled: typeof raw.enabled === "boolean" ? raw.enabled : defaults.enabled,
    hideAiSearch:
      typeof raw.hideAiSearch === "boolean"
        ? raw.hideAiSearch
        : defaults.hideAiSearch,
    spoilerShield:
      typeof raw.spoilerShield === "boolean"
        ? raw.spoilerShield
        : defaults.spoilerShield,
    playerWidth:
      raw.playerWidth === "fill" || raw.playerWidth === "cap"
        ? raw.playerWidth
        : "default",
  };
}
export async function readSettings(): Promise<Settings> {
  return migrateSettings((await chrome.storage.sync.get("settings")).settings);
}
// Popup writes only the edited field, using the latest saved value. Content scripts
// never write defaults on startup, avoiding cross-tab settings races.
export async function updateSettings(
  patch: Partial<Omit<Settings, "schema">>,
): Promise<Settings> {
  const value = migrateSettings({ ...(await readSettings()), ...patch });
  await chrome.storage.sync.set({ settings: value });
  return value;
}
