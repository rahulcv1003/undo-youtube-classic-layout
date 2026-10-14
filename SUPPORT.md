# Help and error reports

## Reporting status

The [public issue chooser](https://github.com/rahulcv1003/undo-youtube-classic-layout/issues/new/choose) is live. The extension's Report a problem action is configured in 0.1.4 and opens the [error form](https://github.com/rahulcv1003/undo-youtube-classic-layout/issues/new?template=broken-layout.yml) with reviewed technical details. Reload the extension and refresh YouTube after updating to use this link.

Open the repository's **Issues → New issue** chooser:

- **Report a broken layout** — layout, refresh/navigation, theater, miniplayer, fullscreen, comments, description, playlist/chat or popup problems.
- **Suggest an improvement** — explain the user problem and your proposed solution.
- **Ask a question** — installation, settings and usage help.

## Collect an actionable error report

1. Reload Undo from `chrome://extensions` and refresh YouTube after updating a development build. A video refresh alone does not load rebuilt extension code.
2. Open Undo on the affected page and choose **Report a problem**.
3. Review the technical details. The GitHub form is prefilled with these details when opened from Undo. If the popup cannot open, report that diagnostics are unavailable and include the extension/browser version manually.
4. Describe what you did, what happened instead of the expected result, and whether it happens consistently.
5. If practical, switch Undo off and refresh to compare, then restore your preferred setting. This helps separate extension effects from YouTube changes.
6. Add an optional cropped screenshot. Review all attachments before submission.

Never include passwords, cookies, authentication tokens, account information, browsing history or unrelated tabs. A video URL is not required. Public repository issues and attachments are public; private repository issues are visible to people with access. The extension does not submit the form for you.

## What the diagnostic preview includes

Extension version; browser version; operating-system family; coarse window-width bucket; detected layout; restoration approach; selector-data version; and selector signal booleans. It excludes video URLs, video titles, channel/account details, comments and cookies.

## Triage process

Maintainers check for duplicates, request missing reproduction details, reproduce with a sanitised fixture and on the real site, add a regression test, then identify the fix version. The repository has **needs-triage**, **needs-information**, **confirmed** and **fixed** status labels. Forms automatically add their category and needs-triage. A closed issue should explain the fix, duplicate or limitation; it should not imply unrelated scenarios passed.

See [known limitations](docs/ROADMAP.md), [test evidence](docs/TEST-RESULTS.md) and the [privacy policy](docs/PRIVACY.md).
