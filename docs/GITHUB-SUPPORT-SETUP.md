# GitHub support hub

Prepared locally; not yet published. The latest request includes publishing the extension source and documentation in the same repository as the error forms. GitHub authentication, owning account and visibility must be confirmed before creation. See the [publication runbook](PUBLISHING.md).

## Included forms

- Broken layout or player controls: affected area, diagnostics, steps, expected behavior, frequency, optional off-state comparison and privacy-reviewed screenshots.
- Feature requests: user problem, proposed improvement and alternatives.
- Setup and usage questions.

Blank issues are disabled so reports use the appropriate form. The bug form retains `broken-layout.yml` and its `diagnostics` field, matching the extension's existing prefill implementation.

The form structure follows [GitHub's official Issue Forms syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms). Local YAML validation does not replace checking the actual hosted form after publication.

## After access is available

1. Confirm owner, repository name and visibility. Reuse an existing repository if the owner supplies one; otherwise create the agreed source repository with Issues enabled.
2. Publish reviewed source, documentation, tests and forms. Exclude local/private inputs, generated dependencies/builds, raw captures and secrets; do not upload this entire workspace automatically.
3. Add labels for bug, enhancement, question, needs-triage, needs-information, confirmed and fixed. Keep intake classification separate from resolution status.
4. Record the remaining real-site checks as issues: installed 0.1.3 validation, fullscreen, playlist/live-chat/premiere scenarios, browser compatibility, performance and accessibility. Do not mark fixes verified beyond their documented evidence.
5. Set the verified repository's `/issues/new` URL in `src/config.ts`. Keep automatic selector hosting, uninstall feedback and other endpoints disabled unless separately configured and verified.
6. Build the extension and verify Report a problem opens the correct bug form with allowlisted diagnostics prefilled. Confirm no video URL, title or account details enter the report.
7. Verify the public issue chooser and supplied forms in GitHub, then share the verified Issues URL.

GitHub Pages or a separate website is optional; GitHub Issues is the reporting hub and does not require another service or a data-collection backend.
