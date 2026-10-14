export function localize(): void {
  document.title = chrome.i18n.getMessage("actionTitle");
  for (const node of document.querySelectorAll<HTMLElement>("[data-i18n]"))
    node.textContent = chrome.i18n.getMessage(node.dataset.i18n!);
}
export function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element ${id}`);
  return node as T;
}
