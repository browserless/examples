// Connects to Browserless via Puppeteer, does work, then closes the session.
//
// Install: npm install puppeteer-core
// Run:     node close-session.mjs

import puppeteer from "puppeteer-core";

const TOKEN = "YOUR_API_TOKEN_HERE";
const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto("https://scraping-sandbox.netlify.app/products", { waitUntil: "networkidle2" });

  const title = await page.title();
  console.log("Page title:", title);
} finally {
  await browser.close();
  console.log("Browser closed — session resources released.");
}
