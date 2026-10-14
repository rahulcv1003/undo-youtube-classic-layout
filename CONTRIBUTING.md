# Contributing

Use a separate browser profile. Never commit cookies, account identifiers, URLs containing tokens, unredacted screenshots or unsanitised DOM exports.

For a selector fix: capture the affected structure, scrub it, add a regression fixture, update `src/sites/youtube/selectors.json`, increment its `dataVersion`, and run `npm run check` plus `npm run test:e2e`. Test the changed behaviour on the real site; fixture success alone is insufficient. Document the browser/version and affected scenarios in `docs/TEST-RESULTS.md`.

Changes must keep permissions narrow, have no telemetry or remote code, preserve native renderers and their event listeners, and undo any mutation when disabled. Avoid adding settings beyond the version 1 brief. Structural detection must fail closed on unknown markup.

Use the existing schema. A code update is required for any schema-version change. Never publish selector data that the released extension cannot validate. All public publishing and store uploads require the owner's release process.
