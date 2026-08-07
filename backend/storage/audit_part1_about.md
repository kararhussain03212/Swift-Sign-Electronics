# Audit: About Page / Value Cards / Team Members / Accolade Cards / Testimonials

Scope: backend/controllers/About*.php, backend/models/About*.php, BaseCrudController.php,
BaseModel.php, admin/src/pages/about/*, src/pages/AboutUs.jsx.

## Bugs found and fixed

1. **Orphaned upload files on image replace (all 5 image-bearing forms).**
   `admin/src/api/uploadApi.js`'s `uploadImage(file, folder, oldPath)` supports passing the
   previous file's path so the backend (`FileUpload::upload()` in
   `backend/utils/FileUpload.php:51-123`, `deleteExistingUpload()` at line 206) deletes the old
   file from `backend/uploads/` after a successful new upload. None of the About admin forms were
   passing `oldPath`, so every photo/avatar/image replace left the previous file behind forever.
   Fixed by threading the current field value through as the third argument:
   - `admin/src/pages/about/AboutTeamMemberForm.jsx:53` — `uploadImage(photoFile, "about", form.photo)`
   - `admin/src/pages/about/AboutTestimonialForm.jsx:56` — `uploadImage(avatarFile, "about", form.avatar)`
   - `admin/src/pages/about/AboutValueCardForm.jsx:64` — `uploadImage(imageFile, "about", form.image)`
   - `admin/src/pages/about/AboutPageSettings.jsx:49-50` — `hero_image`/`ceo_photo`, each now
     passes its own prior value as `oldPath`.
   Verified `FileUpload::deleteExistingUpload()` path-traverses safely (realpath + prefix check
   against uploads root), so this is safe to enable.
   Note: accolade-card `icon` field is a fixed icon-name enum (no file upload), so
   `AboutAccoladeCardForm.jsx` needed no change.

2. **`"about"` folder missing from `FileUpload::ALLOWED_FOLDERS`.**
   `backend/utils/FileUpload.php:38-48`. All About forms call `uploadImage(file, "about")`, but
   `"about"` wasn't in the allow-list, so uploads silently fell back to the `misc/` folder
   (functionally fine — files still uploaded/served correctly — but defeats the folder
   organization other content types get, e.g. `testimonials/`, `profiles/`). Added `'about'` to
   the allow-list (`backend/utils/FileUpload.php:44` area) so new uploads land in the intended
   folder going forward. Existing files already in `misc/` are unaffected (not moved), which is
   expected/acceptable.

## Checked, no bug found

- **HTTP status codes / validation (BaseCrudController, all 5 controllers).** `store`/`update`
  return 422 with `{fields: [...]}` on validation failure via `Validator::required()`
  (`BaseCrudController.php:68-71`), 404 on missing resource for show/update/destroy, 201 on
  create, 200 otherwise — no path returns a raw 500 for validation problems.
- **AboutPageController (`backend/controllers/AboutPageController.php`).** Singleton pattern via
  `AboutPageSetting::find(1)` / `saveSingle()`. `adminUpdate` calls `Cache::clearAll()` (line 43)
  after `saveSingle()`, and `Cache` (`backend/utils/Cache.php`) is a plain file-based cache in
  `backend/storage/cache/*.json` — `clearAll()` unlinks every cached file, so `publicShow`'s
  `Cache::remember('public:about:page', ..., 600)` cannot serve stale data after an admin update.
  Confirmed all 19 fillable columns in `AboutPageSetting::$fillable`
  (`backend/models/AboutPageSetting.php:12-19`) match the keys in the admin form's `EMPTY`/payload
  object in `AboutPageSettings.jsx:10-17` exactly (hero_badge, hero_heading,
  hero_heading_highlight, hero_description, hero_image, anatomy_heading, anatomy_subheading,
  ceo_eyebrow, ceo_quote, ceo_name, ceo_title, ceo_photo, team_heading, team_subheading,
  accolades_eyebrow, accolades_heading, accolades_heading_highlight, accolades_description,
  testimonials_heading, testimonials_subheading) — no field-name typos, `BaseModel::update()`
  persists every fillable key present in the payload (`backend/models/BaseModel.php:132-151`).
- **Response shape parity with `src/pages/AboutUs.jsx`.** Field-by-field check against the
  public renderer: `hero_image` (L97), `ceo_quote`/`ceo_photo`/`ceo_name` (L180-185),
  `card.style_variant`/`card.icon` for value cards (L116-154), `member.photo`/`member.name` for
  team members (L215), `card.size_variant`/`card.icon`/`card.badge_text` for accolades
  (L254-302), `testimonial.rating`/`testimonial.quote`/`testimonial.avatar`/`testimonial.name`
  for testimonials (L352-358) — all match the model `$fillable` arrays and DB columns exactly.
  No mismatches; the "about us dynamic complete" milestone holds up.
- **Reorder endpoints (`about-value-cards/reorder`, `about-team-members/reorder`,
  `about-accolade-cards/reorder`, `about-testimonials/reorder`).** All four models override
  `BaseModel::reorder()` with an identical pattern (e.g.
  `backend/models/AboutTeamMember.php:21-44`): items processed in a transaction, `id` cast to
  `int` and skipped if `<= 0`, `sort_order`/`order_position` cast to `int`, and persisted via a
  parameterized `UPDATE ... SET sort_order = :sort_order ... WHERE id = :id` (PDO prepared
  statement, no string interpolation) — not SQL-injectable. Because the `WHERE id = :id` has no
  extra scoping, a caller with `edit_content` permission could technically reorder rows in the
  same table by passing arbitrary IDs (e.g. IDs from a different but same-shaped dataset) — this
  is bounded to same-table rows only (single UPDATE per table), requires authentication +
  permission already enforced by `requirePermission('edit_content')` in
  `BaseCrudController::reorder()` (line 136), and has no cross-tenant/cross-table impact in this
  single-tenant admin panel, so not treated as an exploitable bug.
- **AboutValueCard/AboutAccoladeCard/AboutTeamMember/AboutTestimonial controllers.** Thin
  subclasses of `BaseCrudController` with correct `requiredCreateFields` matching each form's
  required-field validation (`style_variant` for value cards, `title` for accolades, `name` for
  team members, `quote`+`name` for testimonials) — consistent with what each `*Form.jsx` enforces
  client-side.

## Verification

- `php -l` clean on all edited PHP files (`FileUpload.php`).
- No test data created/modified in the database; all changes are code-only.
