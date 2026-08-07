# Audit — Nav Links, Footer Links, Social Links, Settings, Users, Contact, Customer Addresses, Orders, Auth

Scope owner: this cluster only. PDO/no-framework backend, routes in `backend/routes/*.php`, controllers extend `BaseCrudController`/`BaseController`.

## Bugs found and FIXED

### 1. Order price tampering — client-submitted item price trusted (HIGH — fixed)
`backend/controllers/OrderController.php::publicStore()` (public, unauthenticated checkout endpoint) computed `subtotal`/`total` server-side from `$item['price'] * $item['quantity']`, but `$item['price']` itself came straight from the client's JSON body (`backend/models/Order.php::createWithItems()` also just wrote `$item['price']` into `order_items.unit_price` unchanged). The "server-side recompute" only re-summed attacker-controlled numbers — it did not defend against price tampering at all. Verified live: POSTing `{"product_id":31,"price":0.01,"quantity":2}` against the real `Professional Digital Soldering Station` (DB price 190.00, discount 14%) produced an order at the tampered price before the fix.

**Fix**: `OrderController::publicStore()` now loads each `Product` by `product_id` and recomputes `unit_price = round(price * (1 - discount/100), 2)` server-side, ignoring any client-supplied `price`. Items with a missing/invalid `product_id` get `price = 0.0` (can't be trusted) rather than whatever the client sent. `name` is also backfilled from the DB when absent. `quantity` was already floored to `max(1, …)`, preventing negative-quantity abuse.

Verified after fix: same tampered request now stores `unit_price = 163.40` (= 190 × 0.86), `line_total = 326.80`, matching frontend's discount formula in `src/pages/CheckoutForm.jsx:37` (`price * (1 - discount/100)`). Test order (id 6) was deleted from `orders`/`order_items` after verification — no test data left behind.

Files: `backend/controllers/OrderController.php:29-81`, uses `backend/models/Product.php`.

### 2. Nav Link Items / Footer Links: no FK-existence validation on create/update → 500 instead of 422 (fixed)
`NavLinkItemController` and `FooterLinkController` only extended `BaseCrudController` with `requiredCreateFields`, so `nav_link_id`/`group_id` were never checked to reference a real parent row before insert. The DB does enforce the FK (`fk_nav_link_items_nav_link` / `fk_footer_links_group`, both `ON DELETE CASCADE` — see item 3, this rules out the orphan-row concern), but there is no global exception handler in this app (`backend/index.php` has none, confirmed via grep for `set_exception_handler`), so a bad `nav_link_id`/`group_id` on create previously threw an uncaught `PDOException` → raw PHP fatal/500 instead of a clean 422, exactly the class of bug flagged in the task brief.

**Fix**: both controllers now override `store()`/`update()` to verify the parent row exists (`NavLink::find()` / `FooterLinkGroup::find()`) before delegating to `BaseCrudController`, returning `422` with a `fields` error object on a missing/invalid parent.

Verified live (admin token): `POST /api/admin/nav-link-items {"nav_link_id":999999,...}` → `422 {"fields":{"nav_link_id":"...does not exist."}}`; same for `POST /api/admin/footer-links {"group_id":999999,...}`.

Files: `backend/controllers/NavLinkItemController.php`, `backend/controllers/FooterLinkController.php`.

### 3. Nav Link Items / Footer Links orphan-on-parent-delete — RULED OUT
`BaseModel::delete()` does a plain `DELETE FROM <table> WHERE id = :id` with no application-level cascade. However `SHOW CREATE TABLE` confirms both child tables have DB-level `FOREIGN KEY ... ON DELETE CASCADE`:
- `nav_link_items.nav_link_id → nav_links.id ON DELETE CASCADE`
- `footer_links.group_id → footer_link_groups.id ON DELETE CASCADE`

So deleting a parent Nav Link or Footer Link Group correctly cascades and removes its children at the DB layer; no orphan rows are left. Not a bug — same class of issue as the category/product one elsewhere in the audit, but here the schema already has the constraint.

### 4. UserController — self-privilege-escalation path (MEDIUM — fixed)
`UserController::update()` guards the **protected super admin** account (env `ADMIN_EMAIL`) against role/status/email/password changes, but had no guard preventing any other admin/editor who merely holds the `manage_users` permission from editing **their own** account's `role`, `status`, or `permissions`. Since `AuthMiddleware::can()` grants blanket access once `role === 'admin'`, an editor granted only `manage_users` could `PUT /api/admin/users/{own_id}` with `{"role":"admin"}` and instantly gain full admin rights — classic self-escalation.

**Fix**: added a guard in `update()` — if the target `id` equals the current authenticated user's id and the payload touches `role`, `permissions`, or `status`, the request is rejected with `403`. Editing name/email/password/profile fields for oneself is unaffected. Other admins can still promote/demote other users (that's the intended purpose of `manage_users`); only self-escalation is blocked.

Other UserController checks (ruled out / already fine):
- Password is never included in `serializeUser()` responses (index/show) — `backend/controllers/UserController.php:285-304`.
- `store()` restricts `role` to `admin`/`editor` only (no `super_admin` value exists to grant).
- No plaintext password logging — `ActivityLogger::log()` only logs `(adminId, action, resource, resourceId)`, never the payload.
- `destroy()` already blocks self-delete and protected-super-admin delete.

Files: `backend/controllers/UserController.php:154-260` (update), `285-304` (serializeUser).

## Findings reported, not changed (design/architecture, out of "fix directly" scope)

- **No rate limiting beyond login.** `AuthController::ensureRateLimit()` (file-based, 5 attempts/60s per IP) only guards `/login`. `changePassword`, `updateProfile`, and the public `/api/public/contact` and `/api/public/orders` endpoints have no throttling — a scripted client could spam contact messages or place many orders. Flagged per instructions rather than building new infrastructure.
- **CustomerAddressController raw SQL** (`index`/`show`) builds a `JSON_OBJECT`/`GROUP_CONCAT` query directly with PDO, not through `BaseModel`; all values are parameterized/read-only so no injection risk found, just inconsistent with the rest of the codebase's model layer.

## Verified correct (no bug)

1. **HTTP status codes / validation** — `BaseCrudController` consistently returns `422` for invalid IDs/validation and `404` for missing resources across NavLink, NavLinkItem, FooterLinkGroup, FooterLink, SocialLink. `SettingController::update` returns `422` on empty payload.
2. **SettingController** — singleton key-value table (`settings`, unique `setting_key`). `upsertMany()` uses `INSERT ... ON DUPLICATE KEY UPDATE`, persisting every submitted field. `update()` calls `Cache::clearAll()` after saving, and `Cache::remember()` re-resolves from DB the next time `publicIndex()`/`asMap()` is called (cache files are deleted, not just marked stale) — GET always reflects the latest PUT. No stale-cache bug.
3. **ContactController** — `store()` (public) validates name/email(format)/subject/message(min length 10), returns `422` with field errors. `markRead`/`destroy`/`index`/admin contact-page routes are registered under `registerAdminRoutes()` with `AuthMiddleware::requireAuth` in `backend/routes/admin.php:206-208` — not exposed without auth. Mail failures are caught and logged (`logMailFailure`), never break the request.
4. **AuthController** —
   - `login()`: generic `"Invalid login credentials"` (401) for both unknown email and wrong password — no user-enumeration leak.
   - Rate limiting: 5 attempts/60s per IP via file-backed counter (`storage/login_rate_limit.json`), returns `429`.
   - `changePassword()`: requires and verifies `current_password` via `password_verify()` before allowing change; new password min length 6.
   - JWT: `Jwt::encode`/`decode` used; secret sourced via `Backend\Config\Env` (not hardcoded in this controller — did not find a literal secret string in `AuthController.php`; secret storage itself lives in `backend/utils/Jwt.php`/env config, outside this cluster's controller files but noted as consistent with the rest of the app's env-based config pattern).
   - CSRF: `AuthMiddleware::requireAuth()` additionally enforces a per-token CSRF value on all mutating verbs (`POST/PUT/PATCH/DELETE`) via `X-CSRF-Token` header + `hash_equals`.
5. **OrderController.updateStatus** — status restricted to an explicit enum (`pending/confirmed/shipped/delivered/cancelled`) via `in_array(..., true)`, returns `422` on anything else.
6. **AddressController / CustomerAddressController** — user-address ownership checked on every operation (`address['user_id'] !== $userId` → 404), phone regex validation, admin customer routes correctly gated behind `manage_users` permission.
7. **NavLinkController/FooterLinkGroupController publicIndex** — cached via `Cache::remember('public:...')`, invalidated on every admin mutation through `BaseCrudController`'s `Cache::clearAll()` in store/update/destroy/reorder — no stale-public-data risk.

## Test data hygiene
- Created and then deleted one test order (`id 6`, `order_number SSE-4DA2AA3A`, `order_items.id 13`) used to verify the price-tampering fix. Confirmed removed via `SELECT COUNT(*) FROM orders WHERE id=6` → `0`.
- No test nav-link-items or footer-links were actually created (the 422-validation test requests were rejected before insert, by design).
- No test admin/user accounts were created or left behind.
