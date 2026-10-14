# Architecture

## Runtime boundaries

| Component                          | Responsibility                                                                     | Boundary                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `manifest.json`                    | MV3 registration, browser action and shortcut                                      | Only `storage` and `alarms`; content scripts match HTTPS `www.youtube.com` |
| `src/sites/youtube/content.ts`     | Settings, detection, observers, navigation and status                              | Isolated content-script world                                              |
| `detect.ts` and `selectors.json`   | Independent structural signals and versioned selectors                             | Unknown or classic layouts are not restored                                |
| `relocate.ts`                      | Move original recommendations, adjust reflected attributes, reveal native comments | Save source position and original values for undo                          |
| `restore.css.ts`                   | Bundled scoped styling, startup guard, optional features                           | No downloaded CSS or script                                                |
| `player-modes.ts`                  | Accessible mode labels and missing miniplayer button                               | Calls the native `I` shortcut, not a cloned player                         |
| `theater-bridge.ts`                | Native theater transition using existing watch-page methods                        | Small MAIN-world script; gated by active restoration and required methods  |
| `src/background/service-worker.ts` | Initialise storage, status/icon updates, counters and selector refresh             | Event-driven worker; no persistent backend                                 |
| `src/core/`                        | Settings migration, message/data validation and report generation                  | Strict allowlists for untrusted input                                      |
| `src/ui/`                          | Popup, options, welcome and report-preview pages                                   | Bundled local HTML/CSS/JS                                                  |

## Watch-page lifecycle

1. Install scoped CSS and a bounded startup visibility guard before asynchronous preference reads. The guard reveals the page after 300 ms even if initialisation stalls.
2. Read settings and validated selector data. Synced settings are authoritative; a per-tab boolean hint is only a startup optimisation.
3. On an exact watch URL, locate the root and inspect independent structural signals. A watch-only bootstrap observer handles delayed root creation.
4. For a recognised new layout, move the original recommendations renderer to the secondary column, restore the native metadata/description presentation and initialise native comments. A comment marker records the exact recommendations source position.
5. Reconcile later mutations at the next animation frame, with a non-resetting 32 ms timeout fallback. Disconnect observers while writing to avoid self-triggered loops.
6. Keep verified restoration during watch-to-watch navigation; repair reparented/replaced nodes as needed. Disable or non-watch navigation returns owned changes to their original state where still valid.

The observer watches the watch-root subtree and the parent's immediate children. That covers root replacement without observing the whole document indefinitely. There is no periodic layout polling loop.

## Player modes

The theater bridge handles clicks on the size button and eligible `T` key events only when restoration is active, the target belongs to the player, the page is not fullscreen, and the native methods exist. It delegates the transition and player relocation to YouTube, waiting one animation frame for computed layout state. It does not modify experiment flags. These private methods may change; missing methods fall back to native event handling.

The miniplayer addition inserts one labelled button in existing controls, including nested control groups. If a visible native miniplayer button exists, the extension does not duplicate it. Activation sends the existing native keyboard shortcut. YouTube owns navigation to Home, playback and expansion back to the watch page.

## Data and reporting

Synced preferences store enabled state and feature options. Local storage holds installation/counter/selector-cache metadata. Session storage holds a shared comments-reveal boolean. Current tab status and the video identifier used to avoid repeated counting are memory-only. See [privacy](PRIVACY.md) for the exact boundaries.

Reports are user initiated: the local report page previews extension/browser version, OS, coarse window-width bucket, detected layout, approach, selector version and signal booleans. The GitHub link prefills only this allowlist. Users review and submit the form themselves. The extension never submits reports automatically or includes the current video URL/title/account.

Remote selector fetching exists but is dormant while `config.selectorUrl` is empty. A future endpoint must satisfy the validator, size/time limits and real packaged-extension network checks. Hosting a repository alone must not silently enable this feature.

## Build and verification

TypeScript is checked strictly; esbuild bundles local runtime files. Build and packaging scripts scan for prohibited executable/DOM-write patterns, enforce size/permission limits and allowlist output files. Development dependencies are not shipped in the extension ZIP.

Unit tests cover settings, detection, schemas, privacy and reversible operations. Integration tests load the extension in an isolated browser profile and intercept YouTube requests with local sanitised fixtures. They do not use a developer's cookies or prove every real-site scenario. Live evidence and remaining checks are recorded separately.
