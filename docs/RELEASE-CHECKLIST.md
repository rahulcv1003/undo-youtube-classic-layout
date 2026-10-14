# Release checklist

Current development build: 0.1.4. Source, documentation and Issue Forms are published on GitHub; nothing has been submitted to a store. Normal refresh/navigation was reported working. Theater/miniplayer have live development-code evidence, but complete installed-build validation and actual fullscreen remain pending. See PLAYER-MODES.md and the GitHub issue tracker.

| Brief requirement                                            | Status                                                                                                                                                               |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version bumped and changelog updated                         | Development version 0.1.4 set; CHANGELOG.md added. Public 1.0.0/store release pending.                                                                               |
| Bundled selectors match hosted copy                          | Bundled data validated. Selector hosting remains disabled pending separate packaged-extension network/CORS verification.                                             |
| ZIP from clean checkout, no maps/tests/fixtures              | Development ZIP allowlists runtime assets. Git source is published; first source CI run passed. Final release reproducibility remains pending.                       |
| Fresh Chrome and Edge install, no console errors             | Isolated Edge fixture integration suite implemented. Owner's Chrome load and fresh Chrome/Edge real-site matrix pending.                                             |
| Store copy, real screenshots, promo tile, privacy disclosure | Original extension icons generated. UI screenshots generated. Real before/after, store tile, listing upload and privacy form pending.                                |
| Single purpose statement                                     | Restores the classic layout of YouTube's video page.                                                                                                                 |
| Permission justifications                                    | `storage`: synced preferences, local selector cache/counters and session reveal preference. `alarms`: six-hour selector refresh. No other API permissions requested. |
| Landing/store/report links                                   | Repository and GitHub report links configured. Pages/selector hosting, support email, store and uninstall feedback remain disabled.                                  |
| GitHub report form                                           | Bug, suggestion and question forms live. Hosted diagnostic prefill verified. Category/status labels and seven pending-work issues created.                           |
| Selector publishing workflow                                 | First published source passed GitHub Actions. Selector/Pages publishing remains disabled until network and real-scenario gates pass.                                 |
| Definition of done: every PRD test                           | Not met. See the complete case ledger in `TEST-RESULTS.md`.                                                                                                          |

## Remaining manual development gates

1. Complete the installed 0.1.4 Chrome checks after extension reload: popup states, live on/off, refresh/navigation, reporting and native player interactions. Distinguish these checks from temporary live code injection.
2. Capture and validate playlist, live chat, premiere, chapters/transcript, comments-disabled and theater fixtures in both layouts. Test all native interactions without changing the account.
3. Verify navigation events and 20-video SPA navigation, fullscreen/miniplayer, RTL, responsive widths and zoom, spoilers, and ultrawide options.
4. Complete compatibility, five-run LCP/observer cost, 50-navigation memory and idle-worker checks.
5. Finish real-browser accessibility review, all UI statuses and store assets; maintain the published repository/report forms; configure any future website/selector hosting separately and verify packaged-extension CORS.

The current fixture passes do not imply these manual gates passed.
