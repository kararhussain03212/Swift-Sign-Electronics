# Audit Part 3 — PHPUnit Integration Test Suite

## Setup
- `phpunit.xml` at project root, bootstraps `vendor/autoload.php`, test suite `Integration` points at `tests/Integration`.
- `composer.json` updated with an `autoload-dev` PSR-4 mapping (`Tests\Integration\` -> `tests/Integration/`); ran `composer dump-autoload` to regenerate the autoloader.
- `tests/Integration/ApiTestCase.php`: base class using PHP cURL against the live server at `http://localhost/Electronics/backend/api`. Provides `apiGet/apiPost/apiPut/apiPatch/apiDelete` helpers and a `setUpBeforeClass` that logs in once as `info@sstechnologies.pk` / `SwiftSign@2026`, caching the JWT + CSRF token statically for reuse across all tests in the run.

## Tests written (tests/Integration/*.php)
1. **AuthTest** — valid login → 200 + token; wrong password vs unknown email both → 401 with identical error message (no user-enumeration).
2. **CategoryTest** — full create→get→update→delete round trip; PUT with invalid id → 404.
3. **ProductTest** — super-admin create/update succeeds; PATCH `/admin/products/reorder` returns success (regression guard for the BaseModel::reorder fix). Cleans up created product.
4. **HeroTest** — PATCH `/admin/hero/reorder` returns success.
5. **BlogTest** — two posts with identical titles get disambiguated slugs (`foo`, `foo-2`); cleans up both posts.
6. **BlogCategoryTest** — create category + post referencing it, rename category via PUT, re-fetch post, assert `post.category` reflects the new name; cleans up post + category.
7. **OrderTest** — GETs a real public product's price/discount, POSTs `/public/orders` with a tampered `price` far below the real value, asserts the stored `unit_price` matches the server-computed price (not the tampered value); deletes the test order via the admin endpoint.
8. **UserTest** — PUT own admin id with `{"role":"editor"}` → 403 (self-escalation blocked); throwaway editor user create + delete round trip via admin endpoints.
9. **ForeignKeyValidationTest** — POST `/admin/nav-link-items` and `/admin/footer-links` with a nonexistent parent id (999999) → 422 with field errors, not a 500.

## Run results (actual, `vendor/bin/phpunit tests/Integration --testdox`)
```
PHPUnit 11.5.56 by Sebastian Bergmann and contributors.
..............                                                    14 / 14 (100%)
Time: 00:01.317, Memory: 8.00 MB
OK (14 tests, 58 assertions)
```
All 14 tests across 9 classes passed on the first full run against the live local server — no test bugs or regressions needed fixing.

## DB cleanliness verification
Post-run queries against `swift_sign_electronic` confirmed zero leftover rows matching test-created data patterns (`Test Category%`, `PHPUnit%` products/posts/categories, `phpunit-test-%` admin emails, orders with customer_name `PHPUnit Tester`) — the database was left in its original state.

## Notes
- Order item response field is `unit_price` (not `price`) — test asserts against that field, computed server-side as `round(price * (1 - discount/100), 2)`.
- Blog `category` is stored as a denormalized string on `blog_posts`, so the rename-cascade assertion checks the post's `category` field directly after renaming the parent `blog_categories` row.
