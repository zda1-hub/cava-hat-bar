# Cava development storefront

This is a development preview. No payments are collected, no orders are placed, and no confirmation emails are sent.

The bag is saved only in the current browser (`cava-development-bag`). Each custom design stores hat style, color, size, base band, both layered bands, feather, charm, initials, per-piece position/rotation/scale, tie instructions, notes, and preview total. Edit design opens the saved configuration; it does not flatten the artwork.

## Shopify handoff

When the business supplies its store, connect product/variant IDs and authoritative prices to the catalog. Replace the development checkout action with Shopify cart creation and checkout redirect. Persist a versioned design payload and rendered preview with the order, using a backend or approved customization app; do not put secrets in client code. Configure transactional emails in Shopify. Verify shipping, tax, availability, sizes, and base-hat pricing before launch. Accessories are configured at $8 each and branding at $12 per placement.

Current Rancher rendering assets and Gigi Pip catalog photographs are temporary references requested by the client. Replace them with business-owned/licensed assets before public launch. Size ranges, product descriptions, and base prices require business approval. Tie placement is an instruction only; it does not alter the photograph. Event booking remains a later release.

## Verification performed

In Arc: built a Tear Drop hat with three bands, feather, horseshoe, and initials; reselected and moved each band after adding all pieces; moved the charm; moved/rotated/resized the feather; saved, reloaded, and reopened the design; switched to Camo; dragged a band in a narrow window; checked mobile menu outside-click dismissal and FAQ expansion. Narrow-window checks are not a physical touchscreen-device test.

Asset integrity: `node --test tests/cava-assets.test.mjs`. Production build: `pnpm run build`.
