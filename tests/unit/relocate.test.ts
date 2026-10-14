import { beforeEach, describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { NativeRestore } from "../../src/sites/youtube/relocate";
import { bundledSelectors } from "../../src/core/selectors-store";
describe("reversible native restoration", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = new DOMParser().parseFromString(
      readFileSync("tests/fixtures/youtube/2026-10-14-new-normal.html", "utf8"),
      "text/html",
    ).documentElement.innerHTML;
  });
  it("moves the original node, preserving listeners, and restores the exact source order", () => {
    const root = document.querySelector("ytd-watch-flexy")!,
      rec = root.querySelector(bundledSelectors.containers.recommendations)!,
      parent = rec.parentElement!,
      next = rec.nextSibling,
      listener = vi.fn();
    rec.addEventListener("test", listener);
    const controller = new NativeRestore();
    expect(controller.apply(root, bundledSelectors)).toBe(true);
    expect(root.querySelector("#secondary-inner > #related")).toBe(rec);
    rec.dispatchEvent(new Event("test"));
    expect(listener).toHaveBeenCalledOnce();
    expect(root.hasAttribute("fixed-default-panels")).toBe(false);
    expect(
      root.querySelector("ytd-comments#comments")!.hasAttribute("hidden"),
    ).toBe(false);
    controller.undo();
    expect(rec.parentElement).toBe(parent);
    expect(rec.nextSibling).toBe(next);
    expect(root.hasAttribute("fixed-default-panels")).toBe(true);
    expect(
      root.querySelector("ytd-comments#comments")!.hasAttribute("hidden"),
    ).toBe(true);
  });
  it("is idempotent over repeated observer calls", () => {
    const root = document.querySelector("ytd-watch-flexy")!,
      controller = new NativeRestore();
    controller.apply(root, bundledSelectors);
    const html = root.innerHTML;
    for (let n = 0; n < 20; n++) controller.apply(root, bundledSelectors);
    expect(root.innerHTML).toBe(html);
    controller.undo();
    expect(root.innerHTML).not.toContain("undo:");
  });
  it("repairs a reused recommendations renderer that YouTube moved back", () => {
    const root = document.querySelector("ytd-watch-flexy")!,
      controller = new NativeRestore();
    const rec = root.querySelector(
        bundledSelectors.containers.recommendations,
      )!,
      origin = rec.parentElement!;
    controller.apply(root, bundledSelectors);
    origin.append(rec);
    controller.apply(root, bundledSelectors);
    expect(rec.parentElement?.id).toBe("secondary-inner");
    controller.undo();
    expect(rec.parentElement).toBe(origin);
  });
  it("does not delete a reused renderer when its old source marker disappeared", () => {
    const root = document.querySelector("ytd-watch-flexy")!,
      controller = new NativeRestore();
    const rec = root.querySelector(
        bundledSelectors.containers.recommendations,
      )!,
      origin = rec.parentElement!;
    controller.apply(root, bundledSelectors);
    origin.replaceChildren(rec);
    controller.undo();
    expect(rec.isConnected).toBe(true);
    expect(rec.parentElement).toBe(origin);
  });
  it("makes no partial changes when a required destination is missing", () => {
    const root = document.querySelector("ytd-watch-flexy")!;
    root.querySelector("#secondary-inner")!.remove();
    const before = root.outerHTML;
    expect(new NativeRestore().apply(root, bundledSelectors)).toBe(false);
    expect(root.outerHTML).toBe(before);
  });
  it("does not resurrect a renderer after YouTube replaces its source subtree", () => {
    const root = document.querySelector("ytd-watch-flexy")!,
      controller = new NativeRestore();
    controller.apply(root, bundledSelectors);
    root.querySelector("#below")!.replaceChildren();
    controller.undo();
    expect(root.querySelector("#related")).toBeNull();
  });
  it("restores attribute values, not just presence", () => {
    const root = document.querySelector("ytd-watch-flexy")!;
    root.setAttribute("split-scroll", "original");
    const controller = new NativeRestore();
    controller.apply(root, bundledSelectors);
    controller.undo();
    expect(root.getAttribute("split-scroll")).toBe("original");
  });
  it("activates the native comment loader and restores its original panel state", () => {
    const root = document.querySelector("ytd-watch-flexy")!,
      panel = root.querySelector(bundledSelectors.containers.commentsPanel)!,
      controller = new NativeRestore();
    controller.apply(root, bundledSelectors);
    expect(panel.getAttribute("visibility")).toBe(
      "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED",
    );
    controller.undo();
    expect(panel.getAttribute("visibility")).toBe(
      "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN",
    );
  });
});
