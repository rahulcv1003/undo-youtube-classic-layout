import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearPlayerControls,
  ensureMiniplayerButton,
} from "../../src/sites/youtube/player-modes";

describe("native player controls", () => {
  beforeEach(() => {
    clearPlayerControls();
    vi.stubGlobal("chrome", { i18n: { getMessage: () => "" } });
    document.body.innerHTML = `<ytd-watch-flexy><div id="movie_player" tabindex="0"><div class="ytp-right-controls"><div><button class="ytp-size-button"></button><button class="ytp-fullscreen-button"></button></div></div></div></ytd-watch-flexy>`;
  });
  it("supports nested native controls without duplicating the miniplayer button", () => {
    const root = document.querySelector("ytd-watch-flexy")!;
    ensureMiniplayerButton(root);
    ensureMiniplayerButton(root);
    expect(root.querySelectorAll("#undo-miniplayer")).toHaveLength(1);
    expect(
      root.querySelector(".ytp-size-button")?.previousElementSibling?.id,
    ).toBe("undo-miniplayer");
  });
  it("cleans up owned controls and restores labels when disabled", () => {
    const root = document.querySelector("ytd-watch-flexy")!;
    const size = root.querySelector(".ytp-size-button")!;
    size.setAttribute("aria-label", "Native label");
    ensureMiniplayerButton(root);
    clearPlayerControls();
    expect(size.getAttribute("aria-label")).toBe("Native label");
    expect(size.hasAttribute("aria-pressed")).toBe(false);
    expect(document.querySelector("#undo-miniplayer")).toBeNull();
  });
  it("invokes the native miniplayer shortcut rather than moving or cloning the player", () => {
    const root = document.querySelector("ytd-watch-flexy")!;
    const player = root.querySelector("#movie_player")!;
    const events: string[] = [];
    player.addEventListener("keydown", (e) =>
      events.push((e as KeyboardEvent).key),
    );
    ensureMiniplayerButton(root);
    root.querySelector<HTMLButtonElement>("#undo-miniplayer")!.click();
    expect(events).toEqual(["i"]);
    expect(root.querySelector("#movie_player")).toBe(player);
    expect(document.activeElement).toBe(player);
  });
  it("does not duplicate a visible native miniplayer control", () => {
    document.querySelector(".ytp-right-controls")!.append(
      Object.assign(document.createElement("button"), {
        className: "ytp-miniplayer-button",
      }),
    );
    ensureMiniplayerButton(document.querySelector("ytd-watch-flexy")!);
    expect(document.querySelector("#undo-miniplayer")).toBeNull();
  });
  it("synchronizes the accessible theater state with the page, not stale player labels", () => {
    const root = document.querySelector("ytd-watch-flexy")!;
    root.setAttribute("theater", "");
    ensureMiniplayerButton(root);
    const control = root.querySelector(".ytp-size-button")!;
    expect(control.getAttribute("aria-pressed")).toBe("true");
    expect(control.getAttribute("aria-label")).toBe("Default view (t)");
    root.removeAttribute("theater");
    ensureMiniplayerButton(root);
    expect(control.getAttribute("aria-pressed")).toBe("false");
  });
});
