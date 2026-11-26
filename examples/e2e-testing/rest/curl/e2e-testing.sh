#!/usr/bin/env bash
# Runs an end-to-end test against a remote Browserless browser using the /function API.
# Run: bash e2e-testing.sh

curl -X POST \
  "https://production-sfo.browserless.io/function?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/javascript" \
  --data-raw 'export default async ({ page }) => {
    await page.goto("https://scraping-sandbox.netlify.app/products");

    const title = await page.title();
    const heading = await page.$eval("h1", el => el.textContent.trim());
    const hasLink = (await page.$("a[href]")) !== null;

    const results = [
      { test: "title includes Product Catalog", passed: title.includes("Product Catalog") },
      { test: "h1 reads Product Catalog", passed: heading === "Product Catalog" },
      { test: "page has at least one link", passed: hasLink },
    ];

    return { passed: results.every(r => r.passed), results };
  };'
