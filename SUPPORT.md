# Help and error reports

## Reporting status

The GitHub Issue Forms are prepared in this repository, but the destination repository has not yet been published/verified. The extension's GitHub report button remains unconfigured until its final repository URL is known. Copying diagnostic details works locally in the meantime.

After publication, open the repository's **Issues → New issue** chooser:

- **Report a broken layout** — layout, refresh/navigation, theater, miniplayer, fullscreen, comments, description, playlist/chat or popup problems.
- **Suggest an improvement** — explain the user problem and your proposed solution.
- **Ask a question** — installation, settings and usage help.

## Collect an actionable error report

1. Reload Undo from `chrome://extensions` and refresh YouTube after updating a development build. A video refresh alone does not load rebuilt extension code.
2. Open Undo on the affected page and choose **Report a problem**.
3. Review the technical details. Once the GitHub destination is configured, its form will be prefilled with these details. If the popup cannot open, report that diagnostics are unavailable and include the extension/browser version manually.
4. Describe what you did, what happened instead of the expected result, and whether it happens consistently.
5. If practical, switch Undo off and refresh to compare, then restore your preferred setting. This helps separate extension effects from YouTube changes.
6. Add an optional cropped screenshot. Review all attachments before submission.

Never include passwords, cookies, authentication tokens, account information, browsing history or unrelated tabs. A video URL is not required. Public repository issues and attachments are public; private repository issues are visible to people with access. The extension does not submit the form for you.

## What the diagnostic preview includes

Extension version; browser version; operating-system family; coarse window-width bucket; detected layout; restoration approach; selector-data version; and selector signal booleans. It excludes video URLs, video titles, channel/account details, comments and cookies.

## Triage process

Maintainers check for duplicates, request missing reproduction details, reproduce with a sanitised fixture and on the real site, add a regression test, then identify the fix version. Use **needs-triage**, **needs-information**, **confirmed** and **fixed** as status labels after those labels have been created in GitHub. A closed issue should explain the fix, duplicate or limitation; it should not imply unrelated scenarios passed.

See [known limitations](docs/ROADMAP.md), [test evidence](docs/TEST-RESULTS.md) and the [privacy policy](docs/PRIVACY.md).
