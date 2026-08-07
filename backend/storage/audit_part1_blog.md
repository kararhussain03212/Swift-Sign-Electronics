# Audit: Blog Posts & Blog Categories (incl. Blog Settings)

Scope: `backend/controllers/BlogController.php`, `BlogCategoryController.php`,
`backend/models/BlogPost.php`, `BlogCategory.php`, shared `BaseCrudController.php`/
`BaseController.php`, admin `admin/src/pages/blog/*`, `admin/src/pages/blogCategory/*`,
storefront `src/pages/Blog.jsx`, `src/pages/BlogDetails.jsx`.

## Bugs found and fixed

1. **Missing permission checks on blog post create/update — privilege escalation.**
   `BlogController` overrides `store()`/`update()` (to preserve raw HTML `body` and to
   handle slugs) but, unlike `BaseCrudController::store()/update()` and
   `CategoryController::store()/update()`, never called `$this->requirePermission(...)`.
   Any authenticated admin — even one without the `create_content`/`edit_content`
   permission — could create or edit blog posts via direct API calls, bypassing the
   admin UI's `canSave` gate (`admin/src/pages/blog/BlogForm.jsx:162`), which is
   client-side only.
   Fixed in `backend/controllers/BlogController.php`: added
   `$this->requirePermission('create_content')` at the top of `store()` and
   `$this->requirePermission('edit_content')` at the top of `update()`.
   `BlogCategoryController` had no override at all, so it *did* inherit the base
   class's permission checks — it was fine before this audit, and still is.

2. **No slug-uniqueness handling — duplicate slug crashes with a raw 500.**
   `blog_posts.slug` and `blog_categories.slug` both have a DB-level `UNIQUE KEY`.
   Neither `BlogController` nor `BlogCategoryController` checked for collisions before
   insert/update (unlike `CategoryController::uniqueSlug()` for `categories.cat_key`).
   A duplicate slug (auto-generated from a duplicate title, or manually typed) throws
   an uncaught `PDOException` that bubbles to `backend/index.php:50-52`:
   ```php
   } catch (Throwable $e) {
       Response::error('Server error: ' . $e->getMessage(), 500);
   }
   ```
   This echoes the raw exception message (e.g. `SQLSTATE[23000]: Integrity constraint
   violation: 1062 Duplicate entry 'foo' for key 'slug'`) straight to the client,
   **regardless of `APP_ENV`** — `index.php` only gates `display_errors`, not this
   handler's own message text. (This global catch-all is outside this cluster's scope
   but is the mechanism that made the missing slug check leak internals.)
   Fixed by adding `BlogPost::slugExists()` and `BlogCategory::slugExists()` plus a
   `uniqueSlug()` helper in both `BlogController` and `BlogCategoryController` (mirrors
   `CategoryController::uniqueSlug()`): base-slugify the requested/derived value, then
   append `-2`, `-3`, ... until free. Verified via live API: creating two posts titled
   "Audit Test Post" now yields `audit-test-post` and `audit-test-post-2` instead of a
   500 (test rows cleaned up afterward, see Verification below).

3. **Category rename didn't cascade to `blog_posts.category` (same bug class as the
   already-fixed products.category issue).**
   `blog_posts.category` is `varchar(120)`, a denormalized copy of the category name —
   not a FK to `blog_categories`. `BlogCategoryController` had no `update()` override,
   so renaming a blog category left every post that stored the old name orphaned
   (`blog_posts.category` still held the stale string, so category-filtered listing/
   `paginatePublished()`'s exact-match `category = :category` filter would silently
   stop matching those posts).
   Fixed by mirroring `Category::renameInProducts()` / `CategoryController::update()`:
   - Added `BlogCategory::renameInPosts(string $oldName, string $newName)` in
     `backend/models/BlogCategory.php` — `UPDATE blog_posts SET category = :new WHERE
     category = :old`.
   - Added a `BlogCategoryController::update()` override in
     `backend/controllers/BlogCategoryController.php` that calls it when `name` changes
     (after the slug is disambiguated, before responding).
   Verified via live API: created category "AuditCat", set a post's `category` to it,
   renamed the category to "AuditCatRenamed" via `PUT /api/admin/blog-categories/8`,
   re-fetched the post — `category` field updated to "AuditCatRenamed" automatically.
   Test category/post/rename cleaned up afterward.

## Checked, no bug found

- **HTTP status codes / no leaked 500s (item 1 of the brief).** Every action in
  `BlogController` and the inherited `BaseCrudController` actions (`index`, `show`,
  `destroy`, `reorder`, `publicIndex`, `publicShowBySlug`, `publicSearch`) returns
  proper 422/404/403 via `Response::error()`. `publicBlogSettings()` and
  `adminUpdateBlogSettings()` wrap risky work in `try/catch (\Throwable)` and degrade
  gracefully (empty array / logged error) rather than crashing. The one general leak
  vector is the global catch-all in `index.php` (see bug #2 above) — not specific to
  this cluster, flagged for whoever owns global error handling.
- **Required-field validation.** `store()` enforces `requiredCreateFields = ['title']`
  via `Validator::required()`, returning 422 with a `fields` map
  (`BlogController.php:74-77`, `BlogCategoryController.php` new `store()`). `content`/
  `category` are not hard-required server-side, matching the admin form (only Title is
  marked `*`/required client-side in `BlogForm.jsx:230`) — intentional, not a bug.
- **Slug auto-generation UX parity.** `admin/src/pages/blog/BlogForm.jsx` has the same
  "auto-generate from title unless the slug field is touched" UX
  (`slugTouched` state, `handleTitleChange`/`handleSlugChange`, lines 57-112) as
  `admin/src/pages/blogCategory/BlogCategoryForm.jsx`'s `slugify(form.name)` fallback.
  Consistent.
- **`publicShowBySlug` resolution.** Because `slug` is DB-`UNIQUE` (and now
  additionally enforced app-side per bug #2), `findBySlug()`
  (`backend/models/BaseModel.php:97-108`) always resolves exactly one row — no
  silent-wrong-post risk.
- **Cover image replace/delete.** Not a leak. `FileUpload::upload()`
  (`backend/utils/FileUpload.php:51-131`) accepts an `$oldPath` and calls
  `deleteExistingUpload()` (lines 206-237, path-traversal-safe via `realpath` +
  prefix check) when set. `admin/src/pages/blog/BlogForm.jsx:174` passes the previous
  `imagePreview` path as `old_path` to the generic `/api/admin/upload` endpoint
  (`UploadController.php`) whenever a new file is chosen in edit mode, so the old
  `backend/uploads/...` file is deleted on replace. No leak.
- **`publicSearch` SQL injection / result shape.** `BlogPost::search()`
  (`backend/models/BlogPost.php`) uses fully parameterized `LIKE` queries with
  `%`/`_` escaped before wildcarding, `is_published`/`published_at` visibility filter
  baked into the WHERE clause, and returns a flat array of normalized rows (image
  paths resolved via `normalizeUploadColumns`). Same pattern in
  `paginatePublished()`'s search branch. No injection vector; empty query returns
  `[]` early (`BlogController::publicSearch`, `q === ''`).
- **Blog settings GET/PUT round-trip.** `adminUpdateBlogSettings()` calls
  `Setting::upsertMany($payload)` generically — every key the admin form
  (`admin/src/pages/settings/sections/BlogSettingsSection.jsx`,
  `SiteSettings.jsx` field list: `blog_page_hero_image`, `blog_page_title`,
  `blog_badge_text`, `blog_hero_title`, `blog_hero_title_accent`,
  `blog_hero_description`, `blog_search_placeholder`, `seo_blog_meta_description`,
  etc.) sends is persisted as-is (no allowlist/field-name mismatch possible, since
  it's a free-form key/value settings store), and `publicBlogSettings()` reads back
  everything with a `blog_` key prefix. Round-trips correctly.
- **Storefront field-name parity.** `src/pages/Blog.jsx` and `src/pages/BlogDetails.jsx`
  consume `article.cover`, `.title`, `.slug`, `.category`, `.excerpt`, `.author_name`,
  `.category_color`, `.read_time`, `.published_at`, `.tags` directly — these match
  `BlogPost::$fillable` column names exactly (`backend/models/BlogPost.php:12-18`); no
  snake/camel mismatch.

## Verification

- `php -l` clean on all 4 edited files.
- Live smoke-tested against local XAMPP instance (`swift_sign_electronic` DB,
  logged in as `info@sstechnologies.pk`):
  - Duplicate-title post creation now dedupes slugs (`audit-test-post`,
    `audit-test-post-2`) instead of throwing.
  - Blog category rename cascades to `blog_posts.category` for posts referencing the
    old name.
  - All test rows (`blog_posts.id` 13/14, `blog_categories.id` 8) deleted after
    verification; DB left in original state (posts 7-12, categories 1-6 only).

## Files changed

- `backend/controllers/BlogController.php` — added permission checks + `uniqueSlug()`
  helper in `store()`/`update()`.
- `backend/controllers/BlogCategoryController.php` — added `store()`/`update()`
  overrides with `uniqueSlug()` + `renameInPosts()` cascade call (previously had none,
  relied entirely on `BaseCrudController`).
- `backend/models/BlogPost.php` — added `slugExists()`.
- `backend/models/BlogCategory.php` — added `slugExists()` and `renameInPosts()`.
