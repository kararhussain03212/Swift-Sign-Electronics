import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  // Navigate to products page
  console.log('Loading products page...');
  await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });

  // Hard refresh (cache bypass)
  console.log('Hard refreshing...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Count visible product cards
  const productCards = page.locator('div[class*="product"], div[class*="card"]');
  const count = await productCards.count();
  
  // Get price filter max value
  const priceInputs = page.locator('input[type="range"], input[type="number"]');
  const rangeCount = await priceInputs.count();
  let maxPriceDisplay = 'not found';
  if (rangeCount >= 2) {
    const maxInput = priceInputs.nth(1);
    maxPriceDisplay = await maxInput.inputValue();
  }

  // Get all product titles for a more reliable count
  const titles = page.locator('h3, h4, [class*="title"]');
  const titleCount = await titles.count();

  // Look for "No products" text
  const noProductsText = await page.locator('text=No products|No results').count();

  console.log(`Product elements found: ${count}`);
  console.log(`Title elements found: ${titleCount}`);
  console.log(`Max price display value: $${maxPriceDisplay}`);
  console.log(`"No products" message visible: ${noProductsText > 0 ? 'YES (BUG!)' : 'NO (correct)'}`);

  // Take screenshot
  const screenshotPath = 'tests/e2e/screenshots/products-hard-refresh.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved: ${screenshotPath}`);

} catch (err) {
  console.error('Error:', err.message);
} finally {
  await browser.close();
}
