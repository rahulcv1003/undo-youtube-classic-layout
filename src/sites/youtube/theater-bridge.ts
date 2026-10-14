// Runs in YouTube's world solely to use its existing player-layout methods.
// No settings, account data, experiment flags, or network access are involved.
interface WatchElement extends HTMLElement {
  theater: boolean;
  onTheaterReduxValueUpdate?: (enabled: boolean) => void;
  updateFullBleedElementLocations?: () => void;
  schedulePlayerSizeUpdate_?: () => void;
  player?: { setSizeStyle?: (available: boolean, enabled: boolean) => void };
}
function installTheaterBridge(): () => void {
  function handle(event: Event): void {
    if (document.documentElement.getAttribute("data-undo-yt") !== "on") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const root = target.closest<WatchElement>("ytd-watch-flexy");
    if (
      !root ||
      root.hidden ||
      root.hasAttribute("fullscreen") ||
      !target.closest("#movie_player") ||
      typeof root.onTheaterReduxValueUpdate !== "function" ||
      typeof root.updateFullBleedElementLocations !== "function" ||
      typeof root.player?.setSizeStyle !== "function"
    )
      return;
    if (event instanceof KeyboardEvent) {
      if (
        event.key.toLowerCase() !== "t" ||
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey ||
        target.closest(
          'input,textarea,select,[contenteditable="true"],[role="textbox"]',
        )
      )
        return;
    } else if (!target.closest(".ytp-size-button")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const enabled = !root.theater;
    root.onTheaterReduxValueUpdate(enabled);
    // Polymer computes fullBleedPlayer after its property update. Relocate the
    // original player only after that computation, using YouTube's own method.
    requestAnimationFrame(() => {
      if (
        !root.isConnected ||
        root.hidden ||
        document.documentElement.getAttribute("data-undo-yt") !== "on"
      )
        return;
      root.updateFullBleedElementLocations?.();
      root.player?.setSizeStyle?.(true, enabled);
      root.schedulePlayerSizeUpdate_?.();
    });
  }
  document.addEventListener("click", handle, true);
  document.addEventListener("keydown", handle, true);
  return () => {
    document.removeEventListener("click", handle, true);
    document.removeEventListener("keydown", handle, true);
  };
}
installTheaterBridge();
