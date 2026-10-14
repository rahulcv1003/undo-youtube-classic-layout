import { readSettings, updateSettings, type Settings } from "../core/settings";
import { readSelectors } from "../core/selectors-store";
import { element, localize } from "./i18n";
localize();
const keys = ["hideAiSearch", "spoilerShield", "playerWidth"] as const;
async function render(): Promise<void> {
  const [settings, data] = await Promise.all([readSettings(), readSelectors()]);
  element<HTMLFieldSetElement>("settings").disabled =
    !settings.enabled || data.killSwitch.site;
  element("off").hidden = settings.enabled && !data.killSwitch.site;
  for (const key of keys) {
    const control = element<HTMLInputElement | HTMLSelectElement>(key);
    control.disabled = data.killSwitch.features[key];
    element(`${key}-unavailable`).hidden = !data.killSwitch.features[key];
    if (control instanceof HTMLInputElement)
      control.checked = settings[key] === true;
    else control.value = settings.playerWidth;
  }
}
for (const key of keys)
  element(key).addEventListener("change", (event) => {
    const control = event.target as HTMLInputElement | HTMLSelectElement;
    const patch: Partial<Settings> =
      key === "playerWidth"
        ? {
            playerWidth: (control as HTMLSelectElement)
              .value as Settings["playerWidth"],
          }
        : { [key]: (control as HTMLInputElement).checked };
    void updateSettings(patch)
      .then(() => {
        element("saved").textContent = chrome.i18n.getMessage("saved");
      })
      .catch(() => {
        element("saved").textContent = chrome.i18n.getMessage("saveFailed");
        void render();
      });
  });
chrome.storage.onChanged.addListener(() => {
  void render();
});
void render();
