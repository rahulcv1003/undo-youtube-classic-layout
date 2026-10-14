import type { SelectorData } from "../../core/schema";
interface RemovedAttribute {
  node: Element;
  name: string;
  value: string | null;
  applied: string | null;
}
interface Move {
  node: Element;
  marker: Comment;
  destination: Element;
}
export class NativeRestore {
  private attrs: RemovedAttribute[] = [];
  private move: Move | null = null;
  private root: Element | null = null;
  private metadata: Element | null = null;
  private comments: Element | null = null;
  private commentsPanel: Element | null = null;
  private data: SelectorData | null = null;
  valid(root: Element | null): boolean {
    return (
      root === this.root &&
      !!root?.isConnected &&
      !!this.metadata?.isConnected &&
      !!this.comments?.isConnected &&
      !!this.commentsPanel?.isConnected &&
      !!this.move?.node.isConnected &&
      !!this.move?.marker.isConnected &&
      this.move.destination.isConnected &&
      root.contains(this.move.destination) &&
      root.contains(this.move.node) &&
      root.contains(this.move.marker) &&
      root.contains(this.metadata) &&
      root.contains(this.comments) &&
      root.contains(this.commentsPanel)
    );
  }
  private remove(node: Element, names: string[]): void {
    for (const name of names)
      if (node.hasAttribute(name)) {
        if (!this.attrs.some((a) => a.node === node && a.name === name))
          this.attrs.push({
            node,
            name,
            value: node.getAttribute(name),
            applied: null,
          });
        node.removeAttribute(name);
      }
  }
  apply(root: Element, data: SelectorData): boolean {
    if (this.valid(root)) {
      this.maintain();
      return true;
    }
    this.undo();
    const rec = root.querySelector(data.containers.recommendations),
      target = root.querySelector(data.containers.secondaryHost),
      metadata = root.querySelector(data.containers.metadata),
      comments = root.querySelector(data.containers.comments),
      panel = root.querySelector(data.containers.commentsPanel);
    if (!rec?.parentElement || !target || !metadata || !comments || !panel)
      return false;
    this.root = root;
    this.data = data;
    this.metadata = metadata;
    this.comments = comments;
    this.commentsPanel = panel;
    const marker = root.ownerDocument.createComment(
      "undo: original recommendations position",
    );
    rec.before(marker);
    this.move = { node: rec, marker, destination: target };
    target.append(rec);
    this.maintain();
    return true;
  }
  maintain(): void {
    if (!this.root || !this.data || !this.metadata || !this.comments) return;
    // YouTube often reuses this renderer and moves it back during navigation.
    // Connectivity alone does not mean it is still in the restored column.
    if (this.move && this.move.node.parentElement !== this.move.destination)
      this.move.destination.append(this.move.node);
    this.remove(this.root, this.data.restore.rootAttributes);
    this.remove(this.metadata, this.data.restore.metadataAttributes);
    this.remove(this.comments, ["hidden"]);
    // The new layout's native loader only binds comment continuation data when
    // this reflected panel attribute is expanded. The panel stays CSS-hidden;
    // YouTube renders that data in its original below-player comments section.
    const panel = this.commentsPanel,
      name = this.data.restore.commentsVisibilityAttribute,
      value = this.data.restore.commentsVisibilityValue;
    if (panel && panel.getAttribute(name) !== value) {
      if (!this.attrs.some((a) => a.node === panel && a.name === name))
        this.attrs.push({
          node: panel,
          name,
          value: panel.getAttribute(name),
          applied: value,
        });
      panel.setAttribute(name, value);
    }
  }
  undo(): void {
    if (this.move) {
      // A detached source marker means YouTube replaced that subtree. Never
      // resurrect a stale renderer into the newly created page.
      if (this.move.marker.isConnected && this.move.node.isConnected)
        this.move.marker.replaceWith(this.move.node);
      else {
        this.move.marker.remove();
        if (
          this.move.node.isConnected &&
          this.move.node.parentElement === this.move.destination
        )
          this.move.node.remove();
      }
    }
    for (const { node, name, value, applied } of this.attrs)
      if (node.isConnected && node.getAttribute(name) === applied) {
        if (value === null) node.removeAttribute(name);
        else node.setAttribute(name, value);
      }
    this.attrs = [];
    this.move = null;
    this.root = null;
    this.metadata = null;
    this.comments = null;
    this.commentsPanel = null;
    this.data = null;
  }
}
