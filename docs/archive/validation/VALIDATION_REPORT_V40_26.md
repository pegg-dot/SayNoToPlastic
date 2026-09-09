# Validation Report — v40.26 Inline Navigation Final

Date: 2026-08-10
Base: v40.25 reading-flow polish

## Release intent

v40.26 fixes the final article-navigation defects reported during browser review:

- Science body-system `On this page` links wrapped onto multiple lines.
- Guide `In this guide` links inherited an older sticky, vertical navigation rule, causing the navigation to follow the viewport and overlap Guide text.

The release does not redesign or rewrite the approved long-form content.

## Root-cause verification

The legacy global selector `.guide-article > nav` applies desktop `position: sticky`, `top: 120px`, and `flex-direction: column`. v40.25 introduced `.guide-inline-nav` but did not explicitly reset those inherited properties. v40.26 adds a page-scoped override that sets the inline Guide navigation to normal document flow (`position: static`, `top: auto`) and a single horizontal flex row.

For body-system pages, dynamic full section titles were replaced in navigation only with shorter reader labels (`Overview`, `Why it matters`, `Research`, `Meaning`) while the original section headings and article text remain unchanged.

## Current release-gate audits

All of the following passed after the v40.26 change:

- source audit: 32/32
- internal links: 194 references checked across 66 routes and 71 public assets; 0 broken
- TypeScript/TSX syntax: 124 files; 0 parser failures
- UI readiness: 12/12
- clarity: 28/28
- operations: 58/58
- Dr. Haddad content integration: 141/141
- nothing-left-behind: 319/319
- homepage polish: 34/34
- Science polish: 33/33
- Solutions polish: 33/33
- Guides polish: 20/20
- Book/About polish: 23/23
- Media/Community polish: 25/25
- welcome film: 32/32
- anatomy viewer: 58/58
- homepage anatomy final: 24/24
- Complete Body Atlas: 59/59
- integrated scroll atlas: 24/24
- v40.22 current layout contract: 22/22
- v40.24 content-architecture cleanup: 24/24
- v40.25 reading-flow contract: 22/22
- v40.26 inline-navigation audit: 15/15

Additional syntax checks:

- 39 JavaScript `.mjs` audit/test files passed `node --check`
- 5 Python files passed `py_compile`
- 4 shell scripts passed `bash -n`

## Dependency integrity

`package-lock.json` SHA-256:

`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

The approved lockfile is unchanged. No dependencies were added, removed, replaced, or stubbed.

## Historical audit note

Several older release-specific audits intentionally encode UI that the user later asked to remove or supersede (for example repeated media briefing surfaces, earlier book framing, and older Science-library treatments). Those historical UX contracts are preserved as release provenance but are not v40.26 release gates. Current invariant audits listed above cover the retained functionality and the latest approved information architecture.

## Browser acceptance boundary

This report does not claim a full dependency-backed live-browser render from the OpenAI container. Final visual acceptance remains the local browser review on the user's Mac. The v40.26 static regression audit specifically verifies that:

- Guide navigation is not sticky.
- Guide navigation is explicitly row-directed and non-wrapping.
- Body-system navigation is non-wrapping.
- narrow viewports use horizontal overflow instead of a second line.
- anchor targets keep fixed-header clearance.

## Production safety

- Nothing was published or deployed.
- Existing production Sites state remains untouched.
- v40.25 release records remain packaged for rollback provenance.
