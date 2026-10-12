# Custom presenter combobox — 2026-10-12

Replaces the native presenter select with a themed button/listbox on every
viewport and pointer type. The accepted closed size stays 76×24px with 11px text.
The popup uses the page's dark background, green accent, rounded corners, and a
checkmark for the saved owner. Option rows are 36px high for selection.

The popup is attached to the body to escape the table/card clipping containers.
It is positioned against the visual viewport, capped to the available space,
and opens above the button when there is insufficient room below. Only one list
opens at a time. Outside interactions and Escape dismiss it without saving.

## Behavior and integration

- Combobox/listbox semantics, labelled controls, expanded state, and active
  descendant references follow the [WAI-ARIA select-only pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/).
  DOM focus stays on the button. Arrow keys, Home/End, Enter/Space, Tab, Escape,
  and character matching are supported. Opening explicitly focuses the button,
  including browsers that do not normally focus a button after tapping.
- Polling preserves the trigger, open menu, and active option. Closing a week
  destroys its controls and portal nodes, restoring the existing owner badges.
- Saving blocks additional writes until completion. The saved label changes
  after server confirmation; a failed save keeps the old value and exposes a
  retry message. Read requests that started before a write cannot repaint stale
  data over the result. The server assignment rules and API payloads are unchanged.
- `touch-action: manipulation` on the trigger prevents double-tap gestures from
  competing with rapid touch activation. Normal page scrolling remains available.
- Popup and feedback nodes are excluded from print output. Versioned CSS and
  client URLs deliver the new component together.

## Verification

- Default tests and build passed; runtime files include the new component script.
- Browser regression covers 33 viewport configurations (240–2560px and landscape)
  in Chromium, Firefox, WebKit, Chromium touch, and WebKit touch. Open-menu bounds
  and clipping are tested in addition to the existing compact-card checks.
- Galaxy S24, Galaxy A55, iPad Mini, and iPad Pro 11 Playwright profiles cover both
  orientations with tap events. A bottom-edge trigger explicitly tests upward
  popup placement.
- Interaction checks cover pointer/tap selection, explicit unassignment,
  keyboard selection/cancellation, Tab navigation, open-menu preservation across
  polling, pending saves, failed save/retry, switching menus, outside dismissal,
  search, filters, question expansion, and deadline cleanup.
- Visually inspected mobile and desktop open-menu screenshots against the prior
  compact controls. Closed controls preserve their size; open menus use the new
  requested theme. Real phones/tablets and screen readers were not available;
  this is browser/device emulation, not a claim of exhaustive device validation.

Use `npm run build` then `npm run test:layout` with Playwright installed.
`LAYOUT_BROWSER`, `LAYOUT_TOUCH`, `LAYOUT_DEVICE`, `LAYOUT_ARTIFACT_DIR`, and
`PLAYWRIGHT_MODULE_PATH` configure the optional browser suite. Production checks
only read assignments and open/close menus; they do not change real owners.
