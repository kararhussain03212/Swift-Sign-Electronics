import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = path.join(__dirname, 'screenshots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

const ADMIN = 'http://localhost:5174';
const STORE = 'http://localhost:5175';
const EMAIL = 'info@sstechnologies.pk';
const PASSWORD = 'SwiftSign@2026';

const NAME = 'E2E Test Product XYZ123';
const NAME2 = 'E2E Test Product XYZ123 EDITED';
const SLUG = 'e2e-test-product-xyz123';

const IMG1 = path.resolve(__dirname, '../../backend/uploads/img_6a51ea5532b3b6.98332949.webp');
const IMG2 = path.resolve(__dirname, '../../backend/uploads/img_6a54a795568e46.39712359.webp');

let shotN = 0;
async function shot(page, name) {
  shotN++;
  const p = path.join(SHOT_DIR, `${String(shotN).padStart(2, '0')}-${name}.png`);
  await page.screenshot({ path: p, fullPage: true });
  console.log('SCREENSHOT', p);
  return p;
}

const results = [];
function log(step, ok, detail = '') {
  results.push({ step, ok, detail });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${step} ${detail}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const adminCtx = await browser.newContext();
  const storeCtx = await browser.newContext();
  const admin = await adminCtx.newPage();
  const store = await storeCtx.newPage();
  admin.on('console', (m) => console.log('ADMIN-CONSOLE:', m.text()));
  admin.on('requestfinished', async (req) => {
    if (req.url().includes('upload') || (req.method() === 'PUT' || req.method()==='PATCH') && req.url().includes('product')) {
      console.log('ADMIN-REQ', req.method(), req.url());
    }
  });

  try {
    // a. Login
    await admin.goto(`${ADMIN}/login`, { waitUntil: 'networkidle' });
    await admin.fill('input[name="email"]', EMAIL);
    await admin.fill('input[name="password"]', PASSWORD);
    await shot(admin, 'login-filled');
    await Promise.all([
      admin.waitForURL(/\/(dashboard)?$/, { timeout: 15000 }).catch(() => {}),
      admin.click('button[type="submit"]'),
    ]);
    await admin.waitForTimeout(1500);
    const loggedIn = !admin.url().includes('/login');
    log('a. Admin login', loggedIn, admin.url());
    await shot(admin, 'after-login');

    // b. Create product
    await admin.goto(`${ADMIN}/products/new`, { waitUntil: 'networkidle' });
    await admin.waitForSelector('input[required]');
    // name field is first required text input
    const nameInput = admin.locator('form input[type="text"], form input:not([type])').first();
    await nameInput.fill(NAME);
    const priceInput = admin.locator('input[type="number"]').first();
    await priceInput.fill('123.45');
    // image upload
    const fileInput = admin.locator('input[type="file"]').first();
    if (await fileInput.count()) {
      await fileInput.setInputFiles(IMG1);
      await admin.waitForTimeout(500);
    }
    await shot(admin, 'create-form-filled');
    await Promise.all([
      admin.waitForURL(/\/products$/, { timeout: 15000 }).catch(() => {}),
      admin.click('button[type="submit"]'),
    ]);
    await admin.waitForTimeout(1000);
    await shot(admin, 'after-create');
    const createOk = admin.url().includes('/products') && !admin.url().includes('/new');
    log('b. Create product', createOk, admin.url());

    // c. Storefront verify
    await store.goto(`${STORE}/product/${SLUG}`, { waitUntil: 'networkidle' });
    await store.waitForTimeout(1000);
    const bodyText = await store.textContent('body');
    const foundOnStore = bodyText.includes('E2E Test Product XYZ123');
    log('c. Storefront shows new product', foundOnStore);
    await shot(store, 'storefront-created');
    const imgSrcBefore = await store.locator('img[alt^="Product View"]').first().getAttribute('src').catch(() => null);

    // d. Edit product - find it in admin list, click edit
    await admin.goto(`${ADMIN}/products`, { waitUntil: 'networkidle' });
    await admin.fill('input[placeholder*="Search" i], input[type="search"]', NAME).catch(() => {});
    await admin.waitForTimeout(500);
    const card = admin.locator('h3', { hasText: NAME }).locator('xpath=ancestor::*[.//button[text()="Edit"]][1]').first();
    await card.locator('button:has-text("Edit")').first().click();
    await admin.waitForURL(/\/products\/edit\//, { timeout: 10000 });
    const nameInput2 = admin.locator('form input[type="text"], form input:not([type])').first();
    await nameInput2.fill(NAME2);
    const priceInput2 = admin.locator('input[type="number"]').first();
    await priceInput2.fill('' );
    await priceInput2.fill('199.99');
    await shot(admin, 'edit-form-filled');
    await Promise.all([
      admin.waitForURL(/\/products$/, { timeout: 15000 }).catch(() => {}),
      admin.click('button[type="submit"]'),
    ]);
    await admin.waitForTimeout(1000);
    log('d. Edit product saved', admin.url().includes('/products') && !admin.url().includes('/edit'), admin.url());

    await store.goto(`${STORE}/product/${SLUG}`, { waitUntil: 'networkidle' });
    await store.waitForTimeout(1000);
    const bodyText2 = await store.textContent('body');
    const editReflected = bodyText2.includes('EDITED') && bodyText2.includes('199.99');
    log('d. Storefront reflects edit', editReflected, editReflected ? '' : bodyText2.slice(0,200));
    await shot(store, 'storefront-edited');

    // e. Replace image
    await admin.goto(`${ADMIN}/products`, { waitUntil: 'networkidle' });
    const card2 = admin.locator('h3', { hasText: NAME2 }).locator('xpath=ancestor::*[.//button[text()="Edit"]][1]').first();
    await card2.locator('button:has-text("Edit")').first().click();
    await admin.waitForURL(/\/products\/edit\//, { timeout: 10000 });
    const fileInput2 = admin.locator('input[type="file"]').first();
    await fileInput2.setInputFiles(IMG2);
    await admin.waitForTimeout(500);
    await shot(admin, 'edit-image-selected');
    await Promise.all([
      admin.waitForURL(/\/products$/, { timeout: 15000 }).catch(() => {}),
      admin.click('button[type="submit"]'),
    ]);
    await admin.waitForTimeout(1000);

    await store.goto(`${STORE}/product/${SLUG}`, { waitUntil: 'networkidle' });
    await store.waitForTimeout(1000);
    const imgSrcAfter = await store.locator('img[alt^="Product View"]').first().getAttribute('src').catch(() => null);
    const imageChanged = imgSrcAfter && imgSrcAfter !== imgSrcBefore;
    log('e. Storefront shows new image', imageChanged, `before=${imgSrcBefore} after=${imgSrcAfter}`);
    await shot(store, 'storefront-new-image');

    // f. Delete product
    await admin.goto(`${ADMIN}/products`, { waitUntil: 'networkidle' });
    admin.once('dialog', (d) => d.accept());
    const card3 = admin.locator('h3', { hasText: NAME2 }).locator('xpath=ancestor::*[.//button[text()="Delete"]][1]').first();
    await card3.locator('button:has-text("Delete")').first().click();
    await admin.waitForTimeout(1500);
    await shot(admin, 'after-delete');
    const listText = await admin.textContent('body');
    const deletedFromAdmin = !listText.includes(NAME2);
    log('f. Deleted from admin list', deletedFromAdmin);

    await store.goto(`${STORE}/product/${SLUG}`, { waitUntil: 'networkidle' });
    await store.waitForTimeout(1000);
    const bodyText3 = await store.textContent('body');
    const goneFromStore = !bodyText3.includes('E2E Test Product XYZ123');
    log('f. Gone from storefront', goneFromStore);
    await shot(store, 'storefront-deleted');

  } catch (e) {
    console.error('ERROR', e);
    results.push({ step: 'exception', ok: false, detail: String(e) });
  } finally {
    await browser.close();
  }

  console.log('\n=== SUMMARY ===');
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'} - ${r.step} ${r.detail || ''}`);
  const allOk = results.every(r => r.ok);
  fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(results, null, 2));
  process.exit(allOk ? 0 : 1);
})();
