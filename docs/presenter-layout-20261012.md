# Presenter control layout — 2026-10-12

## Uniform size on Galaxy phones and tablets

The user accepted the PC layout but reported that Galaxy phones still looked
too large. Removed the coarse-pointer override that enlarged controls to 88×32px
and labels to 16px. All pointer types now use the accepted PC size of 76×24px
with 11px text. No desktop layout/style rule changed. The CSS URL is versioned
again so mobile browsers request the updated stylesheet.

Validation: the default tests/build and the five 33-viewport configurations
passed. Added optional `LAYOUT_DEVICE` support to the browser regression test;
Galaxy S24, Galaxy A55, iPad Mini, and iPad Pro 11 emulation each passed portrait
and landscape layout and interaction checks. Inspected phone and tablet
screenshots. These profiles emulate mobile viewport, touch, pixel density, and
user agent; they are not physical-device or Samsung Internet tests. This section
supersedes the larger touch sizes below.

## Badge-sized control and adaptive wrapping

After further user feedback, desktop controls are 76×24px with 11px labels;
coarse-pointer controls are 88×32px with 16px labels. Cards use a wrapping flex
layout: topics retain a 120px preferred width, and the control shares their row
when there is room. Narrow desktop cards wrap the control to a second line.
This reduces the height of wide cards without squeezing topic text.

The select remains a native HTML select with its normal keyboard and popup
behavior. `appearance: none` plus a fixed-size chevron makes label space
predictable: a visual check caught native indicator space truncating names even
when the earlier text-width assertion passed. The regression test now checks
that condition as well as label width, overlap, and unnecessary stacking.

Validation scope: Chromium, Firefox, and WebKit desktop engines; Chromium and
WebKit with touch emulation; 33 viewport sizes per configuration (165 total),
including 240–2560px widths and short landscape screens. Existing interaction
checks and default tests/build passed. Desktop and touch screenshots were
visually inspected. These are browser/viewport simulations, not tests on physical
iPhones, Android phones, or every device/OS/browser combination. This update
supersedes both previous control sizes below.

## Compact control follow-up

The user found the first full-width control too large. It now uses a compact
96px-wide, 30px-high pill on pointer-driven desktops, with 12px text. Editable
card text matches the adjacent 12px topic cards; padding and row gaps are reduced.
The topic stays on a separate row, preventing the original collision.

Devices with any coarse pointer use a 112px-wide control with a 44px minimum
height and 16px text for touch input. The control remains width-constrained at
very narrow viewports. The stylesheet URL is versioned again for this adjustment.

Validation: the default tests/build passed. All 33 viewport cases and interaction
checks passed in Chromium, Firefox, and WebKit, plus touch emulation in Chromium
and WebKit (165 viewport checks total). Visually compared the previous 1440px
render with the compact version, and checked mobile touch rendering. This section
supersedes the full-width/44px-on-all-devices description of the initial fix below.

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
