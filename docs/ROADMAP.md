# Known limitations and next work

This is a development roadmap, not a promised schedule. The seven release-validation workstreams are tracked in [GitHub Issues](https://github.com/rahulcv1003/undo-youtube-classic-layout/issues).

## Before public release

- Validate the complete installed 0.1.4 build in Chrome after extension reload, including refresh, next-video navigation, theater entry/exit, miniplayer expansion and on/off transitions. Existing player-mode evidence used temporary development-code injection. [Issue 1](https://github.com/rahulcv1003/undo-youtube-classic-layout/issues/1).
- Confirm actual fullscreen entry/exit manually; a changed label or simulated click is not sufficient evidence.
- Cover playlists, live streams/chat, premieres, disabled comments, chapters/transcript, restricted videos and native interactions across relevant layouts.
- Complete responsive-width, zoom, RTL and real keyboard/screen-reader checks.
- Run browser/extension compatibility checks and actual performance measurements: startup application time, repeated LCP samples, observer cost, 50-navigation memory stability and idle-worker behaviour.
- Source publication, hosted Issue Forms and the 0.1.4 report destination are complete. Maintain the forms and preserve the reviewed diagnostic allowlist; validate the complete reloaded build as part of issue 1.
- Review screenshots, listing assets, privacy disclosure, clean-checkout packaging and Chrome Web Store submission separately. Repository publication is not a store release.
- If remote selector hosting is enabled later, test the actual packaged-extension network/CORS path first. Keep the endpoint disabled until then.

## Candidate improvements, not implemented

- Pause restoration for just the current tab.
- Optionally reset spoiler reveal state per video rather than per browser session.
- Optional filtering of Shorts recommendations on the watch page.

Prioritise dependable native behaviour over additional settings. The [test ledger](TEST-RESULTS.md) and [release checklist](RELEASE-CHECKLIST.md) remain the evidence sources.
