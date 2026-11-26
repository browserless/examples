#!/usr/bin/env bash
# Clicks a link and waits for navigation to complete using the /function API.
# Run: bash navigate-after-click.sh

curl -X POST \
  "https://production-sfo.browserless.io/function?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/javascript" \
  --data-raw 'export default async ({ page }) => {
    await page.goto("https://scraping-sandbox.netlify.app/products");

    // Register the navigation wait before clicking — if you click first,
    // the page load can complete before waitForNavigation() starts listening.
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click("a[href=\"/contact-us\"]"),
    ]);

    const heading = await page.$eval("h1", el => el.textContent.trim());
    return { url: page.url(), heading };
  };'
