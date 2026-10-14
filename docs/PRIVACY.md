# Privacy policy for the development build

Undo does not collect personal data, analytics or telemetry. It does not send video URLs, titles, account information, cookies, comments or browsing history to its developer.

Settings are stored using Chrome's profile sync storage. Chrome may sync those settings under the user's own browser-account configuration. Local extension storage contains installation time, a total restored-page count, rating-prompt preference, selector cache and selector refresh attempt time. The count does not identify which videos were viewed. A session-only boolean remembers whether the user opened spoiler-shielded comments.

The extension inspects watch-page structure to decide whether the new layout is present. Tab status, detection results and the current video identifier used to avoid double-counting remain in memory and are discarded with the tab or service worker. They are not saved as browsing history.

A per-tab YouTube session-storage hint stores only whether Classic layout was last on or off. It helps the brief startup visibility guard respect the last setting while Chrome loads synced preferences. It contains no video identifier or page content and is not sent anywhere.

The development build makes no automatic external fetch requests. The GitHub support link opens only when a user chooses it. If selector hosting is enabled later, its automatic outgoing request will download a selector JSON data file on browser startup and at most once per six-hour period otherwise. It will omit cookies, credentials and referrer. The hosting provider will receive ordinary network connection information such as an IP address, as with any HTTPS request. No user-specific identifier is added.

A report is optional. Before opening GitHub, the local report page displays the technical details: extension version, coarse browser/OS description, window-width bucket, layout type, signal match booleans, active approach and selector version. The report excludes page content and account details. The user-initiated link sends these reviewed details in URL query parameters to the public repository's error form. GitHub and browser history may retain the visited URL. Nothing is submitted as an issue automatically. Submitted issues and attachments are public; review them before clicking Submit. No email destination is configured.

No remote scripts, fonts or analytics are loaded. All extension interface assets are bundled. There is no account or backend service.

Version 0.1.3 includes a small bundled MAIN-world script on the same YouTube match. Only while restoration is active, it handles theater button/keyboard actions using YouTube's existing layout methods. It reads no account data and changes no experiment flags. The miniplayer button invokes YouTube's existing keyboard handler; playback and navigation remain native. Neither addition sends data or requires extra permissions.

Permissions: `storage` saves settings/cache and the anonymous total count; `alarms` schedules selector refreshes. The content script matches only desktop `www.youtube.com` over HTTPS. It does not match YouTube Music, Studio, mobile, nocookie embeds or other websites.

Before store release, copy this policy to the public privacy page, replace the development endpoint description with the actual host and verify the network behaviour against this policy. Declare no user data collected in the store disclosure if the released implementation continues to match it.
