# Undo interface plan

## 0.1.2 refinement

User feedback: the first UI works but should feel cleaner and more deliberately designed. Keep all existing features and behavior. Replace the unfamiliar square diagram-switch with a conventional toggle whose state is unambiguous. Spend the visual emphasis on that control and the original Undo mark; use typography, alignment and fine dividers for the rest.

Updated palette: white `#FCFCFD`, ink `#252C38`, secondary text `#626B7A`, blue `#315DD0`, rule `#E2E5EB`, graphite `#20242D`. Success uses a small check mark, never color alone. Dark mode uses graphite with lighter blue and secondary text, not an inverted light screenshot.

Popup: compact brand header; Classic layout with a conventional on/off control; one plain current-page status next to a small semantic icon; a single navigation row for Options; a quiet report action and version at the bottom. Remove persistent underlines, the oversized switch, and empty minimum-height status spacing. Keep 320 px width, 14 px body text, visible focus, plain copy and no scrolling.

Options: a narrower reading column with a concise introduction, aligned setting rows, explanations below labels and checkbox controls at the trailing edge. Keep native accessible controls. Replace the large gaps and repeated callout bars with a simple rhythm of labels, help and separators.

No cards, gradients, shadows, decorative animation, uppercase eyebrows, third-party icons, new settings or remote assets. New SVGs are drawn specifically for the existing options/status actions. Review against actual light/dark screenshots before delivery. Feature ideas requested by the owner remain proposals, not changes to the version 1 scope.

Review performed: inspected the new restored popup in both themes and the light options page. Replaced inherited disabled-fieldset opacity with disabled-control opacity so explanatory text remains legible. All existing status screenshots were regenerated; axe found no serious/critical violations in the extension pages in either theme. The original navigation regression suite still passes. Owner taste review and assistive-technology testing are separate remaining gates.

The earlier plan below records the first iteration; its square switch and blue-tinted surfaces are superseded by this refinement.

The interface is a small utility panel, drawn like a page margin with one strong mechanical switch. No cards, decoration, gradients, framework or remote assets.

Palette: paper `#F5F7FA`, ink `#203044`, slate `#52627A`, blue `#234FB5`, rule `#CBD3DE`, night `#182334`. Dark mode uses night as the surface, paper as text, rule as secondary text and a pale blue switch `#9BB9FF` so contrast is maintained. This blue is independent of YouTube branding.

Type: the native system sans stack. Product name 14 px; switch label 22 px; all body and form labels 14 px with a generous line height. No all-capital labels or decorative monospace.

Popup: 320 px wide, one continuous surface. The square switch thumb slides between a stacked-column glyph and a familiar-column glyph; this is the one distinctive detail. Other corners remain nearly square.

```text
Undo
Classic layout          [switch]
Current page status, in plain text
───────────────────────────────
Options
Something looks broken
[rating, only when eligible]
```

Options: one readable column, native form controls and short help text. The master setting remains in the popup. The three optional features go on the options page to avoid a cramped, scrolling popup.

```text
Undo / Options
[ ] Hide YouTube's AI features
[ ] Spoiler shield
Player width on wide screens [select]
Only pages with the new layout change.
```

Welcome: a compact explanation beside a simple original undo mark; on a narrow screen it becomes a single column.

```text
Undo
The familiar layout, back in place.
What changes / already classic / switch off
[Open options]
Not affiliated with YouTube or Google.
```

Principles: give the user one clear control; make unchanged/unknown states as clear as success; keep the interface quieter than the video page.

Review before CSS: moved all optional settings to the options page; rejected a grid of feature cards; replaced a large brand hero with a compact utility title; no animation is necessary. Light/dark palettes are intentionally different rather than filtered or inverted.

Review status: final Chrome screenshots, assistive technology checks and the human recognisability check remain release gates. Development UI must not be described as reviewed until those have been completed.
