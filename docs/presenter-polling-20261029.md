# Roadmap presenter API requests — 2026-10-29

The first API candidate, `itstory-presenters.archerlab.dev`, has no DNS record.
Every request tried it again before the working `itstory-presenters.yama5993.workers.dev`
endpoint. An unconditional four-second interval fetched both the last closed week
and the current open week, and slow cycles could overlap.

The browser and weekly assignment job now use the working Worker hostname.
The browser keeps its four-second local deadline check, but fetches the open week
only every 30–32 seconds. A closed week is cached after one successful final read.
Requests cannot overlap polling cycles; hidden/offline pages pause reads and resume
when visible/online. Failures retry after 30 seconds, doubling up to five minutes.
Requests have a ten-second connection/response-header timeout. Successful selections
update the per-week cache immediately, and week changes cannot reuse another week's
assignments. The script URL version changes so existing browser caches load the fix.

Validation before publication:

- `npm test`: 40 browser handoff cases, 15 scheduling cases, seven assignment cases,
  seven polling cases, two Worker cases, and 1,652 site checks passed. The build
  copied 224 runtime files byte-for-byte.
- Polling regressions cover the hostname, request counts, hidden/offline suspension,
  in-flight exclusion, network/HTTP failure backoff, timeout recovery, week rollover,
  and the final deadline with a failed final read.
- `npm run test:layout`: Chromium passed 33 viewports and selection, unassignment,
  keyboard focus during a real refresh, search, filters, questions and deadline
  transitions. API writes were mocked; production assignments were not changed.
- Before/after screenshots at 1440×900 and 375×667: zero changed pixels in both
  full-page and open-combobox captures. Both versions used the same date and
  read-only production API snapshot. Existing design and visible content preserved.
- Local evidence: `D:/workspace/.seo-cache/itstory-api-20261029`.

Publishing uses the existing GitHub Pages deployment from `main` at repository root.
No Worker source, Durable Object bindings, migrations or production records change.
