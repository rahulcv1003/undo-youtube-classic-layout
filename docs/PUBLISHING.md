# Repository publication runbook

## Current state

Local source, Issue Forms and documentation are prepared. No remote repository, push or live form has been verified. The browser is awaiting GitHub sign-in. The GitHub integration is installed, but this session has not exposed an authenticated publishing route. Do not claim publication based on these local files.

## Choose destination

The requested scope now includes the extension's source code, not only a support hub. Suggested repository name: `undo-youtube-classic-layout`. Confirm the owning account/organisation and visibility. A public repository allows community reports but makes source, history and issue attachments public. A private repository limits reports to people with access. Do not change a private repository to public without explicit approval.

## Review publication contents

Include source, manifest, lockfile, build/test configuration, sanitised fixtures, issue forms, licence and maintained documentation. Review staged filenames and diff before pushing. Exclude dependencies, generated builds/ZIPs, environment files, secrets/keys, raw product brief, raw DOM exports and personal/live browser captures. The local `.gitignore` implements those exclusions; it is not a substitute for a staged-content review.

Retain prior user changes. If no local Git repository exists, initialise one on `main` only when ready to prepare the initial publication commit. Use the authenticated account's verified Git author details; do not invent an author or email. Never force-push or overwrite an existing repository.

## Publish and wire reports

1. Authenticate through the normal GitHub sign-in/connection flow. Never paste a token or password into a chat or commit it.
2. Create the agreed repository, with Issues enabled. If the name already exists, inspect ownership/content instead of replacing it.
3. Commit reviewed files and push to the intended remote. Verify the remote commit matches the local commit.
4. Create labels `bug`, `enhancement`, `question`, `needs-triage`, `needs-information`, `confirmed`, and `fixed` without overwriting existing custom labels.
5. Confirm GitHub displays all three forms in **Issues → New issue**. Ensure the bug form retains the `diagnostics` field ID; the extension uses that ID for prefill.
6. Set `config.reportUrl` to the verified repository's HTTPS `/issues/new` URL and `config.homepageUrl` to its repository URL. Leave selector hosting, uninstall feedback, support email and store endpoints disabled until separately configured.
7. Update reporting/publication status in README, SUPPORT, privacy notes and the support setup document. Build/package and verify report prefill end to end. Do not claim submission: users click Submit themselves.
8. Push the configuration/documentation update. Check GitHub Actions and resolve failures; a local pass does not prove remote CI ran.
9. Share verified repository, issue chooser and error-form links. Document the commit and build version. Installed users must reload the extension and refresh YouTube.

## Seed the work tracker

Open actionable issues for the roadmap's outstanding installed-build, fullscreen, special-video, compatibility, performance and accessibility checks. Include acceptance criteria and existing evidence; do not copy private browser contents. Seed known fixed work only as historical notes/changelog, not fabricated open bugs.

## Continuous integration

The existing workflow runs on push, pull request and manual dispatch with read-only repository permissions. It installs Node 24 dependencies, checks types/lint/unit tests/build/format, installs Playwright Chromium, runs fixture integration tests and uploads the development ZIP. No store upload, website deployment or selector endpoint is enabled by this workflow.
