# Test results

## 0.1.4 GitHub reporting and publication

71 unit tests and 16 isolated Edge integration tests pass locally, along with types, lint, build/security and formatting checks. The report integration asserts the verified GitHub destination, bug template and exact diagnostic query prefill, excluding the private video identifier and page data. All three hosted forms were observed in Chrome; the bug form displayed safe synthetic prefilled diagnostics without a submitted test report. First source-publication commit `c83d32a314eab0c466878657d6f09af6173afb86` passed GitHub Actions on Linux in run `38569650413`. Complete installed-build/player-mode validation remains tracked separately.

## 0.1.3 player-mode repair

71 unit tests and 16 isolated Edge integration tests pass, along with strict TypeScript, lint and build/security checks. Live development-code testing in the owner's Chrome verified theater entry/exit and native miniplayer entry/expansion. See [player-mode evidence and limitations](PLAYER-MODES.md). Installed 0.1.3 refresh verification and actual fullscreen are not yet marked passed.

## Owner feedback and 0.1.2 interface refinement

The owner reports the 0.1.1 refresh/navigation changes are working normally. Special-case video coverage, compatibility and measured performance remain pending. Version 0.1.2 changes only extension UI assets, UI presentation/state styling, one localised explanatory string, and version metadata; the YouTube content code is unchanged. The popup uses a conventional toggle, semantic status icon and compact navigation/footer. Options use aligned setting rows and a narrower reading column. All 66 unit tests and 15 isolated Edge integration tests pass for this build, with no serious or critical axe violations on the light/dark extension pages. Updated popup states, options and responsive welcome screenshots are generated. The new light/dark restored popup and light options page were visually inspected before packaging. Manual screen-reader and owner UI review remain pending.

## 0.1.1 refresh and navigation regression check

14 October 2026: 66 unit tests and 15 isolated Edge integration tests pass. Added twelve consecutive refreshes, preservation of the restored state at navigation start, reused-node reparenting, repair under continuous ten-millisecond DOM updates, replacement of the entire watch root without navigation events, and startup with a root arriving after the former five-second timeout. The repair latency regression requires recovery within 250 ms while mutations continue. The build's own scheduler targets the next paint with a non-resetting 32 ms fallback. Real Chrome testing of the newly reloaded extension is still pending; these fixture checks do not prove zero flicker on every live YouTube experiment.

The earlier 0.1.0 evidence and full manual release ledger below are retained separately.

Date: 14 October 2026 (Asia/Kolkata). Extension: 0.1.0 development. Selector data: 2026-10-14.1. Integration browser: Edge 155.0.4283.45. Live discovery browser: Chrome 154.0.8037.98.

## Executed checks

- TypeScript strict checking and ESLint pass.
- Vitest: 64 tests pass, including both generated live structural snapshots, selector trust boundaries, settings/migrations, report privacy, native-node identity and exact undo behaviour.
- Playwright: 11 integration tests pass in an isolated, headless installed Microsoft Edge profile. All YouTube network traffic is fulfilled by local fixtures. No owner cookies/profile are used.
- Automated axe checks: no serious or critical violations on popup, options, welcome and report pages in light and dark themes.
- All six popup status screenshots in both themes and responsive welcome screenshots generated in docs/screenshots.
- Dependency audit: zero known vulnerabilities at dependency installation/check.
- Windows Playwright Chromium 141/156 packages failed before browser launch with a side-by-side assembly startup error. Edge ran the tests; a Chrome-specific installed-extension run is still required.

## Limited live evidence

The owner's real new-layout page and a separate signed-out classic page were inspected. Complete scrubbed structural fixtures were exported, excluding text, URLs, sensitive attributes and native interactive interiors. CSS-only reflow was rejected after a live test failed to initialise comments and retain the native description. The final reversible native-container controller produced an expandable native description and compact recommendations on the right. With the loader state activated, 20 comment threads loaded in the native below-player section. Description expansion and collapse worked; choosing Newest changed the first displayed comment from an eight-month-old item to a two-day-old item. Undo restored the root layout attributes, hidden native comments state and original recommendation position. All three configured navigation events were observed on one recommendation navigation. These checks used an isolated, temporary live tab and did not change the original user tab or perform account actions. This is development evidence, not a pass of the entire layout/interaction matrix.

## Complete PRD case ledger

“Automated pass” applies only to the described automated contract. “Partial” never means a release gate passed. No unexecuted manual test is marked done. Normal fixtures are not substitutes for playlist/live/premiere/theater captures.

| ID     | Scenario                                                    | Result                         | Evidence / remaining work                                                                  |
| ------ | ----------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| SET-01 | Defaults on fresh install                                   | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| SET-02 | Setting change persists                                     | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| SET-03 | Sync across devices                                         | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SET-04 | Migration from an older settings shape                      | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| SET-05 | Corrupt settings                                            | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| SET-06 | Rating counter stores no history                            | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| SEL-01 | Bundled file is valid                                       | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| SEL-02 | Remote fetch succeeds                                       | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| SEL-03 | Remote fetch fails (offline)                                | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| SEL-04 | Remote file invalid                                         | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| SEL-05 | Remote file has newer schema                                | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| SEL-06 | Remote file contains script-like text                       | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| SEL-07 | Kill switch, whole site                                     | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| SEL-08 | Kill switch, one feature                                    | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| SEL-09 | Fetch frequency                                             | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PER-01 | Install warning                                             | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PER-02 | Permission list                                             | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| PER-03 | No remote code                                              | Automated pass                 | Built runtime assets scanned for eval, Function construction and remote script loads.      |
| PER-04 | Strings localised                                           | Not run / pending              | UI localisation implemented; exhaustive static enforcement not yet added.                  |
| DET-01 | New layout fixture                                          | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| DET-02 | Classic layout fixture                                      | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| DET-03 | Unknown markup                                              | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| DET-04 | One signal missing                                          | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| DET-05 | Real new-layout account                                     | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| DET-06 | Real classic account                                        | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| DET-07 | Logged out                                                  | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| DET-08 | Layout changes mid-session                                  | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| LAY-01 | Normal video                                                | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| LAY-02 | No flash on load                                            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-03 | No flash on navigation                                      | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-04 | Playlist                                                    | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-05 | Live stream with chat                                       | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-06 | Premiere                                                    | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-07 | Chapters panel                                              | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-08 | Transcript panel                                            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-09 | Comments turned off                                         | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-10 | Theater mode                                                | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-11 | Exit theater mode                                           | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-12 | Fullscreen                                                  | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-13 | Miniplayer                                                  | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-14 | Turn off live                                               | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| LAY-15 | Turn on live                                                | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| LAY-16 | Dark and light theme                                        | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-17 | Right-to-left language                                      | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| LAY-18 | Members-only and age-restricted videos                      | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-01 | Expand description                                          | Partial; release check pending | Native expand/collapse verified on one live video; complete scenario matrix pending.       |
| FEA-02 | Timestamp links                                             | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-03 | Comment sorting                                             | Partial; release check pending | Newest selection verified on one live video; complete scenario matrix pending.             |
| FEA-04 | Replies                                                     | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-05 | Comment box                                                 | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-06 | Infinite scroll                                             | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-07 | Action buttons                                              | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-08 | Autoplay next                                               | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-09 | End screen and cards                                        | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| FEA-10 | Keyboard shortcuts on page                                  | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NAV-01 | Home to video                                               | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| NAV-02 | Video to video                                              | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NAV-03 | Back and forward                                            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NAV-04 | Video to Shorts and back                                    | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| NAV-05 | Direct link                                                 | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NAV-06 | Timestamped link                                            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NAV-07 | Observer cleanup                                            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NAV-08 | Late re-render                                              | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| NOC-01 | Home feed                                                   | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-02 | Search results                                              | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-03 | Channel page                                                | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-04 | Shorts                                                      | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-05 | Subscriptions and History                                   | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-06 | Embedded player on another site (`/embed/`)                 | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-07 | `youtube-nocookie.com` embed                                | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-08 | `music.youtube.com`                                         | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-09 | `m.youtube.com` in a mobile-sized window                    | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| NOC-10 | YouTube Studio                                              | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SCR-01 | 1024 px wide                                                | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SCR-02 | 1366 px                                                     | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SCR-03 | 1920 px                                                     | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SCR-04 | 2560 px                                                     | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SCR-05 | 3440 px ultrawide, each player width option                 | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SCR-06 | Browser zoom 67 %, 100 %, 150 %                             | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| SCR-07 | Live resize                                                 | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| POP-01 | Status: new layout                                          | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-02 | Status: classic                                             | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-03 | Status: not a watch page                                    | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-04 | Status: not on YouTube                                      | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-05 | Status: tab open before install                             | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-06 | Status: unknown layout                                      | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-07 | Status: switched off                                        | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-08 | Applies to all tabs                                         | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| POP-09 | Keyboard shortcut                                           | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| POP-10 | Icon state per tab                                          | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| OPT-01 | Hide AI search on                                           | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| OPT-02 | Spoiler shield on                                           | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| OPT-03 | Spoiler shield session memory                               | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| OPT-04 | Options when switch is off                                  | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| OPT-05 | Options apply live                                          | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| REP-01 | Report opens                                                | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| REP-02 | Report content                                              | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| REP-03 | No personal data                                            | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| REP-04 | Email fallback                                              | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| REP-05 | Nothing sent automatically                                  | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| INS-01 | First install                                               | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| INS-02 | Update                                                      | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| INS-03 | Uninstall                                                   | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| INS-04 | Rating line timing                                          | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| INS-05 | Rating line not before time                                 | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| INS-06 | Rating line dismissed                                       | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| ACC-01 | Keyboard only                                               | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| ACC-02 | Screen reader                                               | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| ACC-03 | Contrast                                                    | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| ACC-04 | Automated audit                                             | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| ACC-05 | Reduced motion                                              | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| UIQ-01 | Design plan exists                                          | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| UIQ-02 | Banned patterns                                             | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| UIQ-03 | Copy review                                                 | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| UIQ-04 | Not mistakable for YouTube                                  | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| UIQ-05 | Light and dark designed                                     | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| UIQ-06 | No remote fonts or assets                                   | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| CMP-01 | uBlock Origin (default lists)                               | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| CMP-02 | uBlock Origin with a community "revert layout" filter added | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| CMP-03 | SponsorBlock                                                | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| CMP-04 | Return YouTube Dislike                                      | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| CMP-05 | Enhancer for YouTube or similar all-in-one tools            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| CMP-06 | Dark Reader                                                 | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PRF-01 | Bundle size                                                 | Automated pass                 | Final minified content bundle: 15,776 bytes, below the 30 KB limit.                        |
| PRF-02 | Page load impact                                            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PRF-03 | Observer cost                                               | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PRF-04 | Memory                                                      | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PRF-05 | Idle service worker                                         | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PRV-01 | Network requests                                            | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PRV-02 | No page data stored                                         | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| PRV-03 | No unsafe DOM writes                                        | Automated pass                 | Built runtime scan finds no dynamic innerHTML, outerHTML or insertAdjacentHTML writes.     |
| PRV-04 | Privacy policy matches behaviour                            | Partial; release check pending | Fixture, implementation or limited live evidence only; full brief scenario not signed off. |
| STO-01 | Name and description length                                 | Automated pass                 | Covered by current unit or isolated Edge integration suite.                                |
| STO-02 | Assets present and sized                                    | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| STO-03 | No trademark misuse                                         | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| STO-04 | Landing page Lighthouse                                     | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| STO-05 | Structured data                                             | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| STO-06 | Social previews                                             | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |
| STO-07 | Packed build installs cleanly                               | Not run / pending              | Requires real profiles, longer measurement, hosting or release work.                       |

## Release status

Not ready for a public release. The owner still needs to load dist in Chrome, complete the real scenario matrix, approve the public repository/endpoints and finish the store/hosting work. See RELEASE-CHECKLIST.md.
