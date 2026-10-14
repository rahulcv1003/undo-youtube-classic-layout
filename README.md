# Undo: Classic Layout for YouTube

Development version 0.1.4. Restores the familiar desktop watch layout when the observed October 2026 layout is detected. Classic and unknown layouts are left alone. This version connects privacy-reviewed diagnostics to the public GitHub error form, retaining the theater/miniplayer, refresh/navigation and UI improvements.

After rebuilding, click the extension's **Reload** button at `chrome://extensions`, then refresh the video. Refreshing the video alone continues using the previously loaded extension code.

**This is a local development build, not a store-ready release.** Normal-page live discovery and fixture integration tests are implemented. Playlist, live chat, premieres, disabled comments, full compatibility/performance checks and the release matrix are still open. See [test results](docs/TEST-RESULTS.md).

## Load the development build

1. Open `chrome://extensions` in the Chrome profile that has the new layout.
2. Enable Developer mode, choose **Load unpacked**, and select the project's `dist` folder, not the project root.
3. Reload an already-open YouTube video once, then open Undo from Chrome's extensions menu. The popup reports whether the layout is restored, already classic or unknown.
4. Use **Classic layout** to turn it off immediately, or press `Alt+Shift+Y`. Shortcut assignments can be changed at `chrome://extensions/shortcuts`.

The owner loads the extension by hand, as requested in the product brief. The ChatGPT browser connector used for development is a separate extension.

## Included

- Manifest V3, minimum Chrome 116, access limited to `https://www.youtube.com/*`.
- Structural detection with independent signals, safe unknown state and reversible changes.
- Native expandable description and comments; original recommendations renderer moved to the secondary column without cloning it.
- Live master switch, keyboard shortcut and synced settings.
- Optional AI hiding, session spoiler shield and wide-screen player width controls.
- A local diagnostics preview with allowlisted technical details and a user-initiated GitHub error form.
- Bundled validated selector data; a last-good remote cache, six-hour refresh and kill-switch implementation prepared for hosting.
- Local welcome/options pages, light and dark themes, English localisation and original icons.

## Build and test

Use Node 24 or a compatible Node 22 release and npm.

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
npm run package
```

`dist/` is the unpacked extension. `artifacts/undo-0.1.4-dev.zip` is a ZIP for sharing that folder; extract it before using Load unpacked. Do not install from the project root.

On the current Windows machine the downloaded Chromium 141 and 156 executables fail with a Windows side-by-side assembly error. The full extension integration suite runs in a clean, headless installed Edge profile instead:

```powershell
$env:UNDO_TEST_CHROMIUM='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:e2e
```

Tests never use the owner's Chrome profile, cookies or accounts. All YouTube requests in automated integration tests are intercepted and fulfilled with local fixtures. Screenshots are written under `docs/screenshots/`.

## Approach and remaining release work

Start with the [documentation index](docs/README.md). It covers [architecture](docs/ARCHITECTURE.md), [development history and implementation notes](docs/DEVELOPMENT-NOTES.md), [version history](CHANGELOG.md), [reporting a problem](SUPPORT.md), [remaining work](docs/ROADMAP.md), and the [release checklist](docs/RELEASE-CHECKLIST.md).

The public source repository is [rahulcv1003/undo-youtube-classic-layout](https://github.com/rahulcv1003/undo-youtube-classic-layout). Use [the issue chooser](https://github.com/rahulcv1003/undo-youtube-classic-layout/issues/new/choose) for errors, suggestions or questions. Public URLs are centralised in `src/config.ts`. Automatic selector downloads, uninstall feedback, support email and store/rating destinations remain disabled. No separate website or store listing has been published.

Not affiliated with YouTube or Google. MIT licensed.
