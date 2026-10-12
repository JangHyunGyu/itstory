# Explicit presenter unassignment — 2026-10-12

## Cause and fix

`applySelection` cleared the requested topic, then unconditionally completed the
last empty topic with the last unused presenter. On a fully assigned week, an
explicit clear therefore immediately restored the same presenter. The API saved
and returned that restored value, so refreshing could not fix the selection.

Automatic completion now runs only after a nonempty presenter selection. An
explicit empty selection remains empty. Other assignments, uniqueness, automatic
completion after a positive selection and the Wednesday deadline are unchanged.

## Verification and deployment scope

- Reproduced the old behavior with a complete five-person assignment.
- Seven selection tests cover every topic, four/five-person pools, repeated
  clears, re-selection and existing automatic completion.
- Worker-handler tests cover POST/GET persistence across a new Durable Object
  instance and the unchanged 409 response after the deadline.
- `npm test` passed: 40 browser handoff cases, 15 scheduling cases, seven selection
  cases, two Worker cases, 1,696 validation checks and the static-site build.
- Real local Wrangler/DO API plus the unchanged roadmap UI passed at 1440×900
  and 390×844. Unassignment survived the four-second poll and a page reload;
  other owners stayed unchanged and the released presenter became available.
- Screenshots confirm the existing design. HTML, CSS and frontend JS are not
  changed by this fix. The build copied 232 runtime files byte-for-byte.
- Work is isolated in `D:/workspace/itstory-presenter-fix-20261012`, on `main`.
  Pending work in the original `D:/workspace/itstory` checkout is untouched.
- Publish the `itstory-presenters` Worker; a Pages-only deployment cannot update
  this backend rule. No bindings, migrations or production assignments are reset.
  Production verification uses deployment/source inspection and read-only GETs.

Local evidence: `D:/workspace/.seo-cache/itstory-unassign-20261012`.
