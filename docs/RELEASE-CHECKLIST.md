# Release checklist

Current development build: 0.1.3. GitHub publication is prepared but not yet verified; nothing has been submitted to a store. Normal refresh/navigation was reported working. Theater/miniplayer have live development-code evidence, but the complete installed 0.1.3 validation and actual fullscreen check remain pending. See PLAYER-MODES.md.

| Brief requirement                                            | Status                                                                                                                                                               |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version bumped and changelog updated                         | Development version 0.1.3 set; CHANGELOG.md added. Public 1.0.0/store release pending.                                                                               |
| Bundled selectors match hosted copy                          | Bundled data validated. Hosting pending repository selection. No endpoint is contacted in this build.                                                                |
| ZIP from clean checkout, no maps/tests/fixtures              | Development ZIP allowlists runtime assets. Project is not yet a clean Git checkout; final release reproducibility pending.                                           |
| Fresh Chrome and Edge install, no console errors             | Isolated Edge fixture integration suite implemented. Owner's Chrome load and fresh Chrome/Edge real-site matrix pending.                                             |
| Store copy, real screenshots, promo tile, privacy disclosure | Original extension icons generated. UI screenshots generated. Real before/after, store tile, listing upload and privacy form pending.                                |
| Single purpose statement                                     | Restores the classic layout of YouTube's video page.                                                                                                                 |
| Permission justifications                                    | `storage`: synced preferences, local selector cache/counters and session reveal preference. `alarms`: six-hour selector refresh. No other API permissions requested. |
| Landing/store/report links                                   | All external destinations centralised and inert in `src/config.ts`; public repository, Pages site, support email, listing and uninstall-feedback URL pending.        |
| GitHub report form                                           | Bug, suggestion and question forms prepared, with required reproduction/privacy fields; repository creation and hosted activation pending.                           |
| Selector publishing workflow                                 | CI checks prepared. Pages publishing blocked until endpoints are chosen and the real scenario matrix passes.                                                         |
| Definition of done: every PRD test                           | Not met. See the complete case ledger in `TEST-RESULTS.md`.                                                                                                          |

## Remaining manual development gates

1. Complete the installed 0.1.3 Chrome checks after extension reload: popup states, live on/off, refresh/navigation and native player interactions. Distinguish these checks from temporary live code injection.
2. Capture and validate playlist, live chat, premiere, chapters/transcript, comments-disabled and theater fixtures in both layouts. Test all native interactions without changing the account.
3. Verify navigation events and 20-video SPA navigation, fullscreen/miniplayer, RTL, responsive widths and zoom, spoilers, and ultrawide options.
4. Complete compatibility, five-run LCP/observer cost, 50-navigation memory and idle-worker checks.
5. Finish real-browser accessibility review, all UI statuses and store assets; configure/publicise repository, reports, website and selector hosting; verify CORS from the packaged extension.

The current fixture passes do not imply these manual gates passed.
