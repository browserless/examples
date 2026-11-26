#!/usr/bin/env bash
# Runs multiple DOM queries in a single /function request — title, h1, meta description, and links.
# Run: bash batch-dom-queries.sh

curl -X POST \
  "https://production-sfo.browserless.io/function?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/javascript" \
  --data-raw 'export default async ({ page }) => {
    await page.goto("https://scraping-sandbox.netlify.app/products");

    const data = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector("h1")?.textContent?.trim() ?? null,
      links: Array.from(document.querySelectorAll("a[href]")).map(a => ({
        text: a.textContent.trim(),
        href: a.href,
      })),
      productCount: document.querySelectorAll(".product-title").length,
    }));

    return data;
  };'
