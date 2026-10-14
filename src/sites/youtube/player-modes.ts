const changedLabels = new Map<
  Element,
  Map<string, { original: string | null; applied: string }>
>();
export function clearPlayerControls(): void {
  document.getElementById("undo-miniplayer")?.remove();
  for (const [node, attributes] of changedLabels) {
    for (const [name, { original, applied }] of attributes) {
      if (node.getAttribute(name) !== applied) continue;
      if (original === null) node.removeAttribute(name);
      else node.setAttribute(name, original);
    }
  }
  changedLabels.clear();
}
export function ensureMiniplayerButton(root: Element): void {
  const player = root.querySelector<HTMLElement>("#movie_player");
  const size = player?.querySelector<HTMLButtonElement>(".ytp-size-button");
  if (size) {
    const theater = root.hasAttribute("theater");
    const label =
      chrome.i18n.getMessage(
        theater ? "defaultViewButton" : "theaterModeButton",
      ) || (theater ? "Default view (t)" : "Theater mode (t)");
    for (const [node] of changedLabels)
      if (!node.isConnected) changedLabels.delete(node);
    const attributes =
      changedLabels.get(size) ??
      new Map<string, { original: string | null; applied: string }>();
    changedLabels.set(size, attributes);
    for (const [name, value] of Object.entries({
      "aria-label": label,
      "aria-pressed": String(theater),
      title: label,
      "data-tooltip-title": label,
    })) {
      const previous = attributes.get(name);
      attributes.set(name, {
        original: previous ? previous.original : size.getAttribute(name),
        applied: value,
      });
      if (size.getAttribute(name) !== value) size.setAttribute(name, value);
    }
  }
  const controls = player?.querySelector(".ytp-right-controls");
  if (!player || !controls) return;
  const native = controls.querySelector<HTMLElement>(".ytp-miniplayer-button");
  if (native && getComputedStyle(native).display !== "none") {
    controls.querySelector("#undo-miniplayer")?.remove();
    return;
  }
  if (controls.querySelector("#undo-miniplayer")) return;
  const button = document.createElement("button");
  button.id = "undo-miniplayer";
  button.type = "button";
  button.className = "ytp-button";
  const label = chrome.i18n.getMessage("miniplayerButton") || "Miniplayer (i)";
  button.setAttribute("aria-label", label);
  button.title = label;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("d", "M3 4h18v16H3V4zm2 2v12h14V6H5zm7 5h6v6h-6v-6z");
  svg.append(path);
  button.append(svg);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    player.focus({ preventScroll: true });
    // Invoke YouTube's existing shortcut: it owns the mini player, navigation,
    // playback and expansion. Never clone or detach the video ourselves.
    player.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "i",
        code: "KeyI",
        keyCode: 73,
        which: 73,
        bubbles: true,
      }),
    );
    player.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "i",
        code: "KeyI",
        keyCode: 73,
        which: 73,
        bubbles: true,
      }),
    );
  });
  const anchor = controls.querySelector(
    ".ytp-size-button, .ytp-fullscreen-button",
  );
  if (anchor) anchor.before(button);
  else controls.append(button);
}
