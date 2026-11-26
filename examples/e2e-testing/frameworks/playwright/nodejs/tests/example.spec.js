// Playwright test spec running against a remote Browserless browser.
// Run: npx playwright test

import { test, expect } from '@playwright/test';

test('page has correct title', async ({ page }) => {
  await page.goto('https://scraping-sandbox.netlify.app/products');
  await expect(page).toHaveTitle(/Product Catalog/);
});

test('heading is visible and correct', async ({ page }) => {
  await page.goto('https://scraping-sandbox.netlify.app/products');
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText('Product Catalog');
});

test('page contains a link', async ({ page }) => {
  await page.goto('https://scraping-sandbox.netlify.app/products');
  await expect(page.locator('a[href]').first()).toBeVisible();
});

test('page loads without analytics calls', async ({ page }) => {
  const blocked = [];
  await page.route('**/analytics/**', route => {
    blocked.push(route.request().url());
    route.abort();
  });
  await page.goto('https://scraping-sandbox.netlify.app/products');
  await expect(page).toHaveTitle(/Product Catalog/);
  console.log(`Blocked ${blocked.length} analytics request(s)`);
});
