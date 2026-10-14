# Implementation decisions

## 14 October 2026: development build

Working name: Undo. Version 0.1.0 deliberately signals an unreleased development build.

### Restore strategy

Investigated in the brief's order:

1. CSS-only grid reflow was tested on an isolated live Chrome tab. It repositioned containers but did not initialise YouTube's comments data. The side-panel description also expanded as a large panel rather than behaving like the native collapsed description. The prototype was removed.
2. The verified experiment flags include `web_watch_fixed_default_panels`, `web_fixed_panel_watch_next_grid_swap`, `web_watch_split_scroll` and `web_side_rail_dismissible_panels`. Changing config flags after load and navigating did not completely restore the layout. A document-start flag hook was not validated; the browser connector did not support its raw CDP new-document injection command. No unverified global config interception is shipped.
3. The development implementation uses reversible native DOM changes. It removes verified reflected layout attributes, removes metadata's hide-description/placement attributes, reveals the existing `ytd-comments#comments`, and moves the original recommendations renderer to `#secondary-inner`. A comment marker preserves its exact original position. No renderers are cloned. Original attribute values are saved in memory and restored on disable/navigation. Detached renderers are never resurrected after YouTube replaces their source subtree.

One additional loader detail was verified live: the comments engagement panel must have its `visibility` attribute set to `ENGAGEMENT_PANEL_VISIBILITY_EXPANDED` to initialise comment data for the native below-player comments renderer. Bundled CSS hides the redundant engagement panel. That attribute is restored when the extension stands down.

Live inspection showed the native expandable description and compact right-column recommendations, and a native comments response containing 11 then 20 threads. Full chat, playlist, premiere, disabled-comments and interaction coverage is still required before choosing this strategy for a public release. The CSS-only prototype is not falsely represented as a working fallback; native restoration is the sole active development strategy.

### Startup and navigation

One document-start content bundle replaces the two proposed bundles. This avoids duplicate utilities, settings races and coordinating two asynchronous initialisers while staying below the combined 30 KB budget. In 0.1.1 the stylesheet and pending visibility guard are installed synchronously before storage reads. The guard reveals after 300 ms even if JavaScript stalls. An optional per-tab `sessionStorage` boolean remembers the last enabled state to avoid hiding the watch container when the user previously switched the extension off. It never authorises restoration; synced settings remain authoritative. No video data is stored in the hint.

The long-lived MutationObserver watches the root subtree and its parent's immediate children, so replacing the root cannot strand the observer on a detached tree. Updates are coalesced to the next animation frame, with a non-resetting 32 ms fallback for background tabs. The old trailing 100 ms debounce could starve indefinitely during continuous updates. A startup observer exists only while a watch URL has no root; it disconnects when the root appears or the route leaves `/watch`. The former five-second cutoff could miss slow refreshes and has been removed. Observers disconnect before the extension's own DOM edits. No polling interval exists. `pageshow` reconnects after a back-forward cache restoration.

In 0.1.1 `yt-navigate-start` preserves the verified restoration instead of exposing the new layout while the next video loads. Finish/data-updated events reconcile changes; leaving `/watch` or disabling the extension undoes them. Maintenance also moves reused recommendation renderers back if YouTube reparents them. All three real events were observed during the initial live discovery. The updated fixture suite covers twelve refreshes, continuous DOM churn, reparented nodes, full root replacement and late startup. The full real-profile 20-video navigation matrix remains a release gate.

### Trust boundaries and remote data

Selectors and flags are data. A strict field/type validator rejects unknown keys, unsupported schemas, unsafe selector characters, unbalanced selectors, unknown pseudo-classes, invalid flags and messages. CSS declarations are bundled templates. No remote CSS/JS is evaluated. Browser selector engines must also accept the bundled selectors in tests.

Remote downloads omit credentials and referrer, reject redirects, time out after eight seconds, are streamed with a 32 KB cap, and cannot downgrade data versions. Failed fetches leave the last good cache intact. Attempt times, including failed attempts, rate-limit refreshes. Startup gets the separately specified refresh exception. All fetch endpoints stay empty until hosting is configured.

Chrome's [network request documentation](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests) and the official [API calling guidance](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/chrome-extensions/references/extensions/api-calling.md) were consulted. The hosted GitHub Pages CORS path must be tested in the actual packaged extension before release; no broad host permission has been added on an assumption.

### Session data and reports

The spoiler reveal state is one boolean in `chrome.storage.session`, shared for the browser session. Its access level is set during install/startup to make it available to content scripts. Status and the current video identifier used solely to avoid double-counting a view remain in content-script memory. Only a total count is stored locally. Concurrent view count increments are serialised in the worker.

A local report page previews an exact allowlist. It then links to a prefilled GitHub issue form or email, once destinations are configured. No video URL, title, page text, channel/account data or cookies enter those fields. During development, a copy-details action works without a public destination.

### Phase and release gates

The code and fixture checks have been developed together to expose integration failures early. This does **not** waive the brief's manual phase gates: no phase is declared release-complete while its real-browser tests are pending. Manual multi-device sync, real profile matrix, packaging review and publishing remain explicitly pending in the release checklist. The full scenario fixture set is not yet captured.

### Tooling verification

Node 24.11.1. Package audit reports zero known vulnerabilities after upgrading the build/test dependencies. The Windows Playwright Chromium packages failed before launch with missing side-by-side assembly errors; no system settings or protections were changed. An isolated installed Edge profile runs the extension tests with no owner cookies. CI remains configured to run the normal Playwright Chromium path on Linux.

Time-to-first-apply, five-run LCP, callback timing, 50-navigation heap stability, real Chrome extension installation and long idle-worker checks have not been measured yet. Do not infer those results from the small bundle size.
