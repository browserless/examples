// Playwright test spec running against a remote Browserless browser.
// Run: npx playwright test

import { test, expect } from '@playwright/test';

test('homepage loads and shows products', async ({ page }) => {
  await page.goto('https://automationexercise.com', { waitUntil: 'networkidle' });

  await expect(page).toHaveTitle(/Automation/);

  await page.click('a[href="/products"]');
  await page.waitForSelector('.features_items');

  const products = page.locator('.product-image-wrapper');
  await expect(products).toHaveCount(await products.count());
  expect(await products.count()).toBeGreaterThan(0);
});

test('can add item to cart', async ({ page }) => {
  await page.goto('https://automationexercise.com/products', { waitUntil: 'networkidle' });

  await page.hover('.product-image-wrapper:first-child');
  await page.click('.product-image-wrapper:first-child .add-to-cart');
  await page.waitForSelector('#cartModal');

  await expect(page.locator('#cartModal')).toBeVisible();
});
