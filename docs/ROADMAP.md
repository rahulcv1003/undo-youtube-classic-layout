# Known limitations and next work

This is a development roadmap, not a promised schedule. Items here are not yet GitHub issues unless linked after publication.

## Before public release

- Validate the complete installed 0.1.3 build in Chrome after extension reload, including refresh, next-video navigation, theater entry/exit, miniplayer expansion and on/off transitions. Existing player-mode evidence used temporary development-code injection.
- Confirm actual fullscreen entry/exit manually; a changed label or simulated click is not sufficient evidence.
- Cover playlists, live streams/chat, premieres, disabled comments, chapters/transcript, restricted videos and native interactions across relevant layouts.
- Complete responsive-width, zoom, RTL and real keyboard/screen-reader checks.
- Run browser/extension compatibility checks and actual performance measurements: startup application time, repeated LCP samples, observer cost, 50-navigation memory stability and idle-worker behaviour.
- Publish the source repository and activate/test the Issue Forms; configure and verify the extension's final report link.
- Review screenshots, listing assets, privacy disclosure, clean-checkout packaging and Chrome Web Store submission separately. Repository publication is not a store release.
- If remote selector hosting is enabled later, test the actual packaged-extension network/CORS path first. Keep the endpoint disabled until then.

## Candidate improvements, not implemented

- Pause restoration for just the current tab.
- Optionally reset spoiler reveal state per video rather than per browser session.
- Optional filtering of Shorts recommendations on the watch page.

Prioritise dependable native behaviour over additional settings. The [test ledger](TEST-RESULTS.md) and [release checklist](RELEASE-CHECKLIST.md) remain the evidence sources.
