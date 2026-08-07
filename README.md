# Swift Sign Electronics

Full-stack e-commerce site: a public React storefront, a React admin panel, and a PHP/MySQL backend API — all served from XAMPP.

## Project layout

- `src/` — public storefront (React + Vite). Dev server: `npm run dev` (root `package.json`).
- `admin/` — admin panel (React + Vite, separate app). Dev server: `cd admin && npm run dev`.
- `backend/` — PHP API (no framework, PDO/MySQL). Served by Apache under XAMPP at `/Electronics/backend/api`.
- `backend/database/swift_sign_electronic.sql` — schema + seed data. Import via `npm run migrate` or phpMyAdmin.
- `tests/Integration/` — PHPUnit backend integration tests (HTTP-level, against a running local server).

## Local setup

1. Start XAMPP (Apache + MySQL), project should live at `c:\xampp\htdocs\Electronics`.
2. Import the schema: `npm run migrate` (or import `backend/database/swift_sign_electronic.sql` manually).
3. Copy `backend/.env.example` → `backend/.env` (if present) and fill in DB credentials — defaults to `root`/no password for local XAMPP MySQL.
4. Install frontend deps: `npm install` at the root, and `cd admin && npm install`.
5. Run the storefront: `npm run dev` (root).
6. Run the admin panel: `cd admin && npm run dev` (separate terminal, separate port).

## Using the admin panel

Log in at the admin panel's `/login` route with an admin account (see `backend/database/swift_sign_electronic.sql` seed data, or create one via `UserController`).

The sidebar covers every piece of site content:

- **Products / Categories** — the product catalog. Category `cat_key` (slug) auto-generates from the name; renaming a category automatically updates every product already tagged with the old name.
- **Orders** — view customer orders and update fulfillment status. Prices shown are always the server-recomputed price at time of order, not whatever the checkout page sent.
- **Hero Slides / Section Banners** — homepage carousel and promotional banners. Drag-to-reorder is available on Hero Slides.
- **Blogs / Blog Categories** — blog content. Slugs auto-generate and are guaranteed unique (duplicate titles get `-2`, `-3`, ... appended automatically).
- **Blog Page / Contact Page / About Page** — page-level settings (hero text, SEO fields, layout copy) for each of those public pages.
- **Contact Messages** — inbox for messages submitted via the public Contact form. Mark as read or delete.
- **Nav Links / Footer** (under Site settings) — the navbar menu (including dropdown sub-items) and footer link columns + social links.
- **Users** — manage other admin/editor accounts and their permissions. You cannot change your own role/permissions/status (prevents accidental or malicious self-escalation) — ask another admin to do it.
- **Site Settings** — global site-wide key/value settings (tagline, contact info, etc.).

**Image uploads**: replacing an image on any form (product photo, team member photo, banner background, etc.) automatically deletes the old file from the server — you don't need to manage `backend/uploads/` manually.

**Permissions**: non-super-admin accounts need explicit `create_content`/`edit_content`/`manage_users` permissions (set via the Users page) to perform the corresponding actions — the API enforces this server-side, not just in the UI.

## Testing

- **Backend integration tests** (PHPUnit, HTTP-level against a running local server):
  ```
  vendor/bin/phpunit tests/Integration --testdox
  ```
  Requires XAMPP Apache + MySQL running locally with the schema imported.
- **Manual smoke test**: `npm run build` (root) and `cd admin && npm run build` should both complete with no errors.

## Hardening fixes (previously flagged, now fixed)

These were found during the data-pipeline audit ([full report](backend/storage/AUDIT_REPORT.md)) and initially left open as architecture-level items — since fixed:

- **Rate limiting** now covers the public Contact form (5 requests/5min per IP), public checkout/`orders` (10/5min), and authenticated `change password` (5/5min), via a new shared `backend/utils/RateLimiter.php` (same file-backed sliding-window approach `/auth/login` already used). Exceeding the limit returns `429`.
- **`CustomerAddressController`** now goes through a proper model (`backend/models/Customer.php`) instead of raw SQL directly in the controller, consistent with the rest of the codebase.
- **Product gallery images** are now cleaned up individually — removing a single image from a product's gallery (not just deleting the whole product) deletes that file from `backend/uploads/` too. Diffs old vs. new image set on every product update.
- **Global exception handler** (`backend/index.php`) no longer leaks raw exception messages (SQL errors, file paths, stack traces) to the client when `APP_ENV=production` — it logs the real error server-side via `error_log()` and returns a generic message instead. Local/dev mode (`APP_ENV=local`) still shows the real message for debugging.

## Audit report

A full data-pipeline audit (every API endpoint, admin↔frontend wiring, security review, 19 bugs found and fixed) is documented in [`backend/storage/AUDIT_REPORT.md`](backend/storage/AUDIT_REPORT.md).
