# GitHub support hub

Published in [rahulcv1003/undo-youtube-classic-layout](https://github.com/rahulcv1003/undo-youtube-classic-layout), a public repository approved by the owner. Source and documentation share the repository with error, suggestion and question forms. The extension's 0.1.4 build uses this verified destination.

## Included forms

- Broken layout or player controls: affected area, diagnostics, steps, expected behavior, frequency, optional off-state comparison and privacy-reviewed screenshots.
- Feature requests: user problem, proposed improvement and alternatives.
- Setup and usage questions.

Blank issues are disabled so reports use the appropriate form. The bug form retains `broken-layout.yml` and its `diagnostics` field, matching the extension's existing prefill implementation.

The form structure follows [GitHub's official Issue Forms syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms). Local YAML validation does not replace checking the actual hosted form after publication.

## Completed setup

1. Created the approved public source repository with Issues enabled.
2. Published reviewed source, documentation, tests, generated extension-only screenshots and forms. Excluded private/local inputs, dependencies/build output, raw captures and secrets.
3. Retained default category labels and added needs-triage, needs-information, confirmed and fixed. Forms assign category plus needs-triage.
4. Created seven [pending-work issues](https://github.com/rahulcv1003/undo-youtube-classic-layout/issues) with evidence and acceptance criteria; none are claimed fixed simply because they were recorded.
5. Configured the verified `/issues/new` URL and repository homepage in `src/config.ts`. Automatic selector hosting, uninstall, email and store endpoints remain disabled.
6. Local browser integration tests verify the report URL, chosen template, exact diagnostic prefill and excluded private fields.
7. Checked all three hosted forms in the public chooser and the bug form's safe test prefill in Chrome. No dummy issue was submitted.

GitHub Pages or a separate website is optional; GitHub Issues is the reporting hub and does not require another service or a data-collection backend.
