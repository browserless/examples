// Connects to Browserless via Playwright, does work, then closes the session.
//
// Install: npm install playwright-core
// Run:     node close-session.mjs

import { chromium } from "playwright-core";

const TOKEN = "YOUR_API_TOKEN_HERE";
const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}&stealth`
);

try {
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://scraping-sandbox.netlify.app/products", { waitUntil: "networkidle" });

  const title = await page.title();
  console.log("Page title:", title);
} finally {
  await browser.close();
  console.log("Browser closed — session resources released.");
}
