# Presenter control layout — 2026-10-12

## Cause and fix

The desktop table put a topic, its number, and a select with a 104px minimum
width on the same flex row inside a roughly 190px card. The remaining topic
width was about 40px. Long words could paint under the select. Between 761px
and the table's minimum width, the page also required horizontal scrolling.

- An editable card now places the topic above a full-width native select.
- The client adds/removes `is-editable` together with the select, including
  deadline transitions. API payloads, scheduling, and assignment logic are unchanged.
- Selects have a 44px minimum target height, 16px text, and a visible focus ring.
- At 1280px and below, the existing card layout replaces the fixed-width table.
  Topic columns fit the available space; cell minimum widths are reset explicitly.
- Filters wrap, and short landscape screens do not use sticky headers/toolbars.
- The stylesheet is screen-only, preserving the existing print presentation.
- Versioned stylesheet/client URLs avoid reusing the previous cached assets.

## Validation

- `npm test`: all existing tests passed; 1,696 site checks passed, zero failures;
  233 runtime files built with byte-identical copies.
- `npm run test:layout`: passed in Chromium, Firefox, and WebKit. Each engine
  checked 33 viewports spanning 240–2560px, breakpoint edges, and short landscape
  layouts. Assertions cover horizontal overflow, topic clipping/overlap,
  native select label width, and touch target height.
- Browser interactions passed: selection, explicit unassignment, retained focus
  across polling, search, phase filters, question expansion, and the change from
  editable to read-only after the deadline.
- The browser test freezes the date and mocks the presenter API using the real
  assignment function. It does not write production assignment data.
- Compared a baseline screenshot at 900px with the updated page; visually
  inspected updated desktop (1440px), tablet (900px), and mobile (390px) renders.
  Topic text remains readable and separate from controls. The requested layout
  change retains the site's colors, native select behavior, and content.
- Browser engines and viewport emulation were tested; physical devices were not.

## Re-running the browser checks

Build with `npm run build`. With Playwright and its Chromium browser installed,
run `npm run test:layout`. `PLAYWRIGHT_MODULE_PATH` may point to an existing
Playwright installation. Set `LAYOUT_BROWSER` to `firefox` or `webkit` to check
the other engines, and `LAYOUT_ARTIFACT_DIR` to save screenshots. The test starts
and closes its own local static server. These optional browser checks are kept
separate from the dependency-free default test command.

## Integration

Work was isolated in a separate checkout on `main`, based on `a7cefdc`, preserving
the concurrent timeline edits and the earlier unassignment fix. The original
working folder was not modified. Production publishing uses the repository's
existing GitHub Pages deployment after pushing `main`.
