# Development notes: what was done and how

## Objective

Restore a familiar desktop watch page without replacing native video playback, description, comments or recommendations. Keep controls simple, permissions narrow and changes reversible. The current version is 0.1.4, not a store-ready release.

## 0.1.0 — restoration foundation

The initial investigation compared the newer layout with classic structure and inspected actual native containers. CSS-only reflow was tried first: it moved content visually, but did not initialise comment data or preserve the desired native description behaviour. Runtime experiment-flag changes did not produce a complete reliable restoration either, so neither was shipped as a purported fallback.

The implemented strategy reuses original nodes. The recommendations renderer moves to the secondary column; a comment marker remembers its source position. Verified reflected layout and metadata attributes are removed with their original values recorded. The existing comments renderer is revealed. The comments engagement panel is marked expanded to trigger its native loader while scoped CSS hides that redundant panel. Disabling restores owned state, avoiding resurrection of stale detached renderers.

The foundation also added structural detection, schema-validated selectors, migrated settings, popup/options/welcome/report pages, a background worker, localisation, icons, privacy-safe diagnostics, packaging checks and fixture tests.

## 0.1.1 — refresh and video-navigation reliability

Reported symptoms were intermittent loss of classic layout and a visible transition during refresh/navigation. The implementation addressed several separate causes:

- A trailing debounce could be postponed by continuous YouTube updates. Scheduling now coalesces at the next animation frame with a fixed 32 ms fallback.
- A startup timeout could miss a slow root. Watch-only discovery now lasts until a root appears or the route leaves the watch page.
- An observer on an old root could miss replacement. Its parent's immediate child list is observed too.
- Undoing at navigation start exposed the new layout while the next video loaded. Verified restoration is preserved through that interval and reconciled when data arrives.
- Reused recommendations could be moved back by YouTube. Maintenance checks actual parentage and repairs it.
- A synchronous stylesheet and bounded 300 ms visibility guard reduced initial transition exposure, with an optional boolean enabled-state hint and `pageshow` recovery.

Automated regressions cover repeated refreshes, continuous DOM churn, reused/reparented recommendations, full root replacement, slow startup and late comment replacement. Normal use was reported improved; full long-run real-profile performance measurement is still pending.

## 0.1.2 — interface refinement

The popup and options were refined with conventional switches, neutral colours, clearer hierarchy, restrained status presentation and aligned option controls. The restoration logic stayed unchanged. Light/dark screenshots and automated serious/critical accessibility checks were added; they do not replace a complete keyboard/screen-reader audit.

## 0.1.3 — theater and miniplayer compatibility

Live tests reproduced a player button changing its label without changing actual theater layout. The symptom also occurred with restoration switched off followed by refresh. This YouTube variant disabled theater support through a flag and omitted the miniplayer button, but the native `I` shortcut still worked.

Broad experiment-flag changes were tested and rejected. The shipped fix uses a small bundled MAIN-world theater bridge to call the existing native transition and relocation methods, with method checks and active-state gating. The isolated script restores a missing miniplayer button that invokes the native shortcut. No video is cloned and no experiment flag is changed by shipped code.

Live development-code tests verified theater widening, keyboard return, native miniplayer activation and expansion. The installed extension still reported 0.1.2 during those tests: complete installed 0.1.3 refresh validation remains a separate check. Actual fullscreen could not be confirmed in the automation session. See [player-mode evidence](PLAYER-MODES.md).

## Repository and support preparation

The repository now has an indexed documentation set, changelog, contribution guidance, release checklist, privacy policy, roadmap, publication runbook and three Issue Forms. The error form collects the affected area, diagnostics, steps, expected behaviour, frequency and optional comparison/screenshots. Suggestions and questions have separate forms. Blank issues are disabled to improve intake quality.

Private/local inputs are excluded from version control: dependencies, output ZIPs/builds, test artifacts, environment files, key files, the local product brief and live browser captures. Sanitised fixtures and generated extension-only screenshots can be reviewed for publication separately from personal browser captures.

The user approved public source and forms. The repository was created under the verified `rahulcv1003` account and reviewed files were published using the authenticated GitHub connector. Its commit was fetched into the local checkout, whose staged tree matched the published tree. No browser cookies or tokens were transferred into Git credentials.

Version 0.1.4 configures the verified GitHub report/homepage links. The hosted chooser displayed all three forms; the bug form accepted synthetic privacy-safe diagnostic prefill without a submitted test issue. Seven real pending-work issues were created with acceptance criteria. Category and status labels support triage. Source/publication history starts on 14 October 2026; earlier version notes describe development work, not fabricated historical Git commits.

The first published source commit passed GitHub Actions on Linux. Local 0.1.4 checks passed 71 unit and 16 isolated Edge integration tests, including the configured report URL and privacy assertions. Selector hosting, store release, email and uninstall endpoints remain disabled. See [publication status](PUBLISHING.md) for evidence and remaining checks.

## Maintenance rules

Reproduce a reported issue, record actual layout state rather than trusting button labels, add a sanitised regression, make the narrowest reversible change, run checks, and validate on the real site. Update both the evidence ledger and changelog. Do not mark an entire scenario passed because a mock or one live video worked.
