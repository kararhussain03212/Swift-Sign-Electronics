# Audit: Hero Slides, Section Banners, Categories, Products, UploadController

Scope: backend/controllers/{HeroController,SectionBannerController,CategoryController,ProductController,UploadController,BaseCrudController,BaseController}.php,
backend/models/{HeroSlide,SectionBanner,Category,Product,BaseModel}.php, admin/src/pages/{slider,sections,category,product}/*, root src/ storefront consumers.

## Bugs found and FIXED

### 1. Missing permission checks in HeroController::store/update (auth bypass)
`backend/controllers/HeroController.php` (store ~L26, update ~L51) overrides `BaseCrudController::store()/update()` to add try/catch error mapping, but the override dropped the `$this->requirePermission('create_content'|'edit_content')` call that the base class has. Any authenticated admin (regardless of role/permissions) could create/edit hero slides even without the `create_content`/`edit_content` permission — `AuthMiddleware::can()` (backend/middleware/auth.php:55) returns `false` for non-`admin` roles lacking that permission, so this was a real privilege-escalation gap for limited-permission staff accounts.
**Fix:** added `$this->requirePermission('create_content');` / `'edit_content'` back at the top of both methods.

### 2. Missing permission checks in ProductController::store/update (auth bypass)
Same issue as #1: `backend/controllers/ProductController.php` store (~L26) and update (~L51) override the base methods (to add slug/JSON-field handling) and also omitted `requirePermission()`. Any logged-in admin could create/edit products without `create_content`/`edit_content` permission.
**Fix:** added the same `requirePermission()` calls.

(Note: CategoryController and BaseCrudController's own store/update already call `requirePermission()` correctly — verified not affected.)

### 3. Reorder endpoint always fails for Hero and Products (BaseModel::reorder hardcoded wrong column)
`backend/models/BaseModel.php::reorder()` only checked `hasColumn('order_position')` and wrote to `order_position`. But per `backend/database/swift_sign_electronic.sql`, `hero_slides`, `categories`, `section_banners`, and `products` all use a `sort_order` column — only the `settings` table has `order_position`. Routes `PATCH /api/admin/hero/reorder` and `PATCH /api/admin/products/reorder` are registered (backend/routes/admin.php:69, 97) and routed through this shared reorder(), so calling them always hit `hasColumn('order_position') === false` and returned `false` → controller responded 422 "Failed to reorder items" every time. The reorder feature was completely non-functional for these two resources.
**Fix:** `BaseModel::reorder()` now falls back to `sort_order` when `order_position` doesn't exist, and reads the incoming position from either `order_position` or `sort_order` in each item. Verified with `php -l`.
(CategoryController/SectionBannerController have no reorder route registered in admin.php, so they were not user-facing-broken, but now work too if a route is ever added.)

### 4. Orphaned image files on Section Banner replace (no old_path passed)
`admin/src/pages/sections/SectionBannerForm.jsx` (~L75) called `uploadImage(imageFile, "sections")` without the third `oldPath` argument when replacing an existing `bg_image`. `FileUpload::upload()` (backend/utils/FileUpload.php:121) only deletes the previous file when `old_path` is supplied, so every banner image replacement left the old file behind in `backend/uploads/` forever. Contrast with `SliderForm.jsx` (hero images), which correctly passes `oldPath`.
**Fix:** changed the call to `uploadImage(imageFile, "sections", form.bg_image || "")`, matching the SliderForm pattern.

## Checked and ruled out (no bug)

- **Auth/permission wiring for Category and base CRUD**: `CategoryController::store/update` and `BaseCrudController::store/update/destroy/reorder` all correctly call `requirePermission()`. `SectionBannerController` inherits base CRUD without overriding store/update, so it was never affected by bug #1/#2.
- **Status codes**: `show`/`destroy`/`update` correctly return 404/422 via `Response::error`; `store` returns 201; `BaseController::body()` and array-typed validation prevent PHP warnings/notices on malformed input (bad JSON falls back to `[]`, non-JSON falls back to `$_POST`).
- **UploadController**: validates `file` presence (422), delegates size/extension/mime checks to `FileUpload::upload()` which returns proper 422s, not raw exceptions. `deleteExistingUpload()` path-traversal guarded via `realpath()` + prefix check against the uploads root — safe.
- **Reorder input validation** (`BaseCrudController::reorder`, `backend/controllers/BaseCrudController.php:134`): rejects non-array/empty `items` with 422; `BaseModel::reorder()` only ever writes to a hardcoded, non-user-supplied column name (`order_position`/`sort_order`) via a fixed prepared statement — no SQL injection or arbitrary column write is possible since the column name isn't taken from request input, only the id/position values are, and those are bound as parameters.
- **Response field-name alignment for Hero/Section Banners**: `src/api/shopApi.js` wraps `fetchHeroSlides`/`fetchSectionBanners`/`fetchSectionBanner` results through `normalizeHeroSlide`/`normalizeSectionBanner` adapter functions, so the storefront doesn't consume raw backend field names directly — `slide.image` maps to the backend's `image` column correctly. `slide.cta` referenced in `src/pages/Home.jsx:164` is inside a commented-out JSX block (dead code), not a live mismatch.
- **Category image upload leak**: `CategoryForm.jsx` has no file upload at all (icon is a plain text icon-name field), so there's no image-replace path to leak for categories.
- **Product gallery images**: `ProductForm.jsx` uploads new gallery images without an `old_path` (unlike single-image resources), but this is inherent to a multi-image gallery where images can be reordered/removed independently rather than "replaced" 1:1 — not treated as a bug since there's no well-defined "old" image slot to clean up; flagging as a possible future enhancement only, not fixed.
- **Product/Hero store `try/catch` error mapping** (`HeroController::toClientError`): converts raw DB exceptions to friendly 422 messages instead of leaking 500s — good pattern, no fix needed.

## Files changed
- `backend/models/BaseModel.php` — `reorder()` now supports `sort_order` fallback.
- `backend/controllers/HeroController.php` — restored `requirePermission()` in `store()`/`update()`.
- `backend/controllers/ProductController.php` — added `requirePermission()` in `store()`/`update()`.
- `admin/src/pages/sections/SectionBannerForm.jsx` — pass `old_path` on image replace to avoid orphaned uploads.

All modified PHP files verified with `php -l` (no syntax errors).
