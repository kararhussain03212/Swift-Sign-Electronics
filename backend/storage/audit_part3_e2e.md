# Admin Panel Audit — Part 3: End-to-End Test

## Setup

- Created a self-contained Playwright harness at `tests/e2e/` (own `package.json`,
  `playwright@1.62.1` installed locally — not added to `admin/` or root `package.json`).
  Run with `cd tests/e2e && node run.mjs`.
- Test script: `tests/e2e/run.mjs`. Screenshots saved to `tests/e2e/screenshots/`.
- Servers used: admin dev server on `http://localhost:5174` (already running, left
  untouched), storefront dev server on `http://localhost:5175` (started for this task
  via `npm run dev -- --port 5175`, **stopped** at the end — PID 26828 killed).
- Backend: existing XAMPP/Apache PHP API at `http://localhost/Electronics/backend/api`
  against the local `swift_sign_electronic` MySQL DB — no backend changes needed.

## Scenario

Using two isolated browser contexts (one "admin", one "storefront") in one Playwright
run:
1. Log into the admin panel with the real admin credentials.
2. Create a new product "E2E Test Product XYZ123" (price 123.45) with an image upload,
   via `/products/new`.
3. Load the storefront product page directly (`/product/e2e-test-product-xyz123`) and
   confirm the new product appears.
4. Edit the product in admin (rename to "...XYZ123 EDITED", price 199.99), save, then
   reload the storefront page and confirm the new name/price appear.
5. Edit again, replace the product image with a different source file, save, then
   reload the storefront page and confirm the gallery `<img>` src actually changed.
6. Delete the product from the admin list, then confirm it disappears from the
   storefront listing/detail page.

## Results (final run — all green)

| Step | Result |
|---|---|
| a. Admin login | PASS |
| b. Create product (with image) | PASS |
| c. Storefront shows new product | PASS |
| d. Edit product saved (admin) | PASS |
| d. Storefront reflects name/price edit | PASS |
| e. Storefront shows replaced image (new `src`) | PASS |
| f. Deleted from admin list | PASS |
| f. Gone from storefront | PASS |

Screenshots (paths under `tests/e2e/screenshots/`):
`01-login-filled.png`, `02-after-login.png`, `03-create-form-filled.png`,
`04-after-create.png`, `05-storefront-created.png`, `06-edit-form-filled.png`,
`07-storefront-edited.png`, `08-edit-image-selected.png`,
`09-storefront-new-image.png`, `10-after-delete.png`, `11-storefront-deleted.png`.

## Bugs found (via E2E testing)

### 1. Real bug, fixed: deep links to `/product/:slug` always redirected to home

`src/pages/ProductDetails.jsx` reads the product from `ShopContext`'s `products` array,
which starts as `[]` and is populated asynchronously by a `fetchProducts()` call on
mount. The "product not found → redirect home" `useEffect` fired on the very first
render, before the fetch resolved, so `product` was always `undefined` at that point —
meaning **any direct navigation or fresh page load of a product URL (deep link, shared
link, page refresh) silently bounced the visitor to the home page**, even for products
that exist. This surfaced immediately in step (c) of the test: navigating straight to
the product URL always landed on `/`.

Fix applied:
- Added a `productsLoaded` boolean to `ShopContext` (`src/context/ShopContext.jsx`),
  set `true` once the initial `fetchProducts()` call settles (success or failure).
- `ProductDetails.jsx` now only redirects to home when `productsLoaded && !product`,
  so it waits for the real product list before deciding the product doesn't exist.

Verified fixed: re-ran the full scenario after the patch — all 8 steps pass, including
direct-URL loads at steps (c), (d), and (e).

### 2. Minor, not fixed (out of scope): deleting a product does not delete its uploaded image file

Deleting a product via the admin panel removes the DB row but leaves the uploaded image
file(s) on disk under `backend/uploads/`. Confirmed by observing 9 orphaned
`img_*.webp` files accumulate there across test runs/edits despite every test product
being deleted. Not fixed as part of this audit (backend delete-handler change, more
invasive); manually cleaned up the files this session created.

## Cleanup confirmation

- DB: `SELECT COUNT(*) FROM products WHERE name LIKE '%XYZ123%'` → `0`.
- Orphaned uploads: 9 leftover `img_*.webp` files from repeated test runs identified
  and deleted from `backend/uploads/`.
- Dev servers: storefront server on port 5175 (started for this task) stopped. Admin
  server on port 5174 (already running before this task) left running, untouched.
