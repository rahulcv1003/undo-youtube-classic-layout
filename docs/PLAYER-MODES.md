# Player-mode compatibility — 0.1.3

Live testing in the owner's connected Chrome reproduced the theater control changing its label without changing the watch-page theater state or player width. The failure also occurred with Undo switched off followed by a page refresh. This YouTube variant supplied `disable_theater_mode: true` and omitted the miniplayer button, while the native `I` shortcut still activated the real miniplayer and navigated home.

Broad runtime experiment-flag changes were probed and rejected; they are not shipped. Temporary flags were reset. The production fix is a small bundled, gated MAIN-world theater handler and an isolated-world miniplayer button. Theater calls the existing native watch-page transition and waits one animation frame for the computed full-bleed state before asking YouTube to relocate and resize its original player. No videos are cloned. No player containers are directly moved by extension code. Existing native miniplayer controls are preferred if present.

## Evidence and limitations

- Live development-code injection into the owner's Chrome: theater button entered a full-width player (1392.8 px versus the default 853.3 px); keyboard T returned it to normal. Confirmed with YouTube's original experiment flag unchanged.
- Added miniplayer button activated YouTube's native miniplayer on Home. Expand returned the same video to its watch page. Native I also worked independently.
- Screenshots: `screenshots/live-theater-0.1.3-crop.png` and `screenshots/live-miniplayer-0.1.3-crop.png` (cropped to omit the account header).
- Fullscreen click did not enter actual fullscreen in this browser automation session. Do not mark fullscreen verified from a label or click alone; a manual check remains required.
- The installed extension still reported 0.1.2 during live testing. Updated 0.1.3 code was tested through temporary developer injection, not a reloaded installed build. The owner must reload Undo at chrome://extensions, then refresh the video. Fresh-install/refresh validation of the complete installed 0.1.3 build remains pending that step.
- Automated native-mode test uses a local mock of YouTube's layout methods and shortcut, testing wiring, relocation ordering, off-state gating and nested controls. It is not proof that every live YouTube variant supports the same private methods. Missing methods fall back to native handling without intercepting the action.

Private YouTube methods may change. Revalidate after site changes and do not expand this bridge into a general page API or an experiment-flag override.
