# Selector data and discovery

Data version: `2026-10-14.1`. Schema: 1. Discovery date: 14 October 2026, Asia/Kolkata.

## Observed structures

The owner's Chrome tab exhibited `ytd-watch-flexy[fixed-default-panels][side-rail-dismissible-panels]`, recommendations nested inside `#primary`, comments in `#secondary #panels [target-id='engagement-panel-comments-section'] ytd-comments[engagement-panel]`, and `#fixed-side-menu yt-side-rail-view-model`. All three required new-layout signals plus the side-rail signal must match. Neither an attribute alone nor a lone generated class is sufficient.

A separate signed-out in-app browser exhibited no fixed/default side-rail attributes, recommendations directly under `#secondary-inner`, and a visible native `ytd-comments#comments` below the player. All three classic signals must match. If both groups or neither group match, detection returns unknown.

The recommendations use `yt-lockup-view-model` with `.ytLockupViewModelHost`, `.ytLockupViewModelContentImage` and `.ytLockupViewModelMetadata`. These presentation classes were verified in the live page but may change; they are used for styling rather than layout identification. `.you-chat-entrypoint-button` was verified on the AI Ask control; normal search is never selected.

The native description is stamped when `hide-description` and the observed metadata placement attributes are removed. The native comments container exists even on the new layout but is initially hidden. Activating the engagement panel's reflected visibility initialises its data; the redundant panel remains visually hidden while the native section renders it.

## Fixtures

- `2026-10-14-new-live-scrubbed.html` and `2026-10-14-classic-live-scrubbed.html` are generated structural exports from the real pages, with chunk-length checks to avoid truncation.
- All text, links, media URLs, styles, account names, avatars, tokens and video/channel identifiers are removed. Native interactive element interiors and script/style/SVG contents are omitted so exported HTML parses consistently; container hierarchy, custom elements and an explicit structural attribute allowlist are retained.
- `*-normal.html` are smaller, reduced structural fixtures used for isolated extension tests. They include synthetic input/buttons to test CSS and contain no account data.
- Full layout scenario exports for playlists, live streams, premieres, disabled comments, chapters/transcripts and theater mode are still required. Current tests do not claim coverage of those cases.

No original unsanitised DOM is persisted. Generated fixture files are excluded from extension packaging. Unit tests check that the live exports end correctly, contain no source URLs/tokens/owner name, and produce the expected detection results.

## Schema 1 fields

| Field              | Contract                                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaVersion`    | Exactly 1; future schemas rejected.                                                                                                                      |
| `dataVersion`      | `YYYY-MM-DD.revision`; numeric revisions, no downgrade.                                                                                                  |
| `killSwitch`       | `site`, four named boolean feature switches, plain message up to 240 characters. `true` disables the corresponding module/feature.                       |
| `detection`        | Root selector plus `newLayoutSignals` / `classicLayoutSignals`, each containing at least two `requireAll` selectors and optional `requireAny` selectors. |
| `containers`       | Exact set of named selector strings in `core/schema.ts`; no CSS declarations.                                                                            |
| `experimentFlags`  | Observed flag names only. Currently documentation/data; no flag override script shipped.                                                                 |
| `navigationEvents` | Bounded list of `yt-...` event names.                                                                                                                    |
| `restore`          | Reflected root/metadata attribute name arrays plus the constrained comments visibility attribute/value.                                                  |

The entire downloaded response is capped at 32 KB. Unknown keys, non-boolean switches, invalid values, selector escapes, declaration separators, URLs, arbitrary pseudo-classes and script-like strings are rejected. The worker retains the last valid data, falling back to the bundled version when necessary. All mutation declarations, CSS templates and control flow remain in the shipped extension.

## Updating selectors

Capture and scrub a fresh observed fixture first. Change data, increment `dataVersion`, run unit and extension integration tests, and complete the affected real-browser scenario checks. Publish only after confirming the candidate data works and the schema remains compatible. Leave the remote endpoint unconfigured until the owner selects public hosting.
