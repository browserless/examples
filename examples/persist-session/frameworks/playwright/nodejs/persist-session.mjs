// Creates a long-lived Browserless session, connects via Playwright to set state,
// disconnects, then reconnects and verifies state persisted.
//
// Install: npm install playwright-core
// Run:     node persist-session.mjs

import { chromium } from "playwright-core";

const TOKEN = "YOUR_API_TOKEN_HERE";

// Create a long-lived session
const sessionResponse = await fetch(
  `https://production-sfo.browserless.io/session?token=${TOKEN}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ttl: 300000, stealth: true }),
  }
);
const session = await sessionResponse.json();

// Connect and set browser state
const browser = await chromium.connectOverCDP(session.connect);
try {
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://automationexercise.com", { waitUntil: "networkidle" });

  await page.evaluate(() => {
    localStorage.setItem(
      "shoppingCart",
      JSON.stringify({ items: [{ id: 1, name: "Blue Top" }], totalItems: 1, totalPrice: 500 })
    );
    localStorage.setItem("userPreferences", JSON.stringify({ theme: "dark", language: "en" }));
  });

  console.log("State set. Closing browser...");
} finally {
  await browser.close();
}

// Reconnect — a new browser process starts but loads persisted data from disk
const browser2 = await chromium.connectOverCDP(session.connect);
try {
  const context2 = browser2.contexts()[0] ?? await browser2.newContext();
  const page2 = await context2.newPage();
  await page2.goto("https://automationexercise.com", { waitUntil: "networkidle" });

  const cart = await page2.evaluate(() => localStorage.getItem("shoppingCart"));
  const prefs = await page2.evaluate(() => localStorage.getItem("userPreferences"));

  console.log("Cart:", JSON.parse(cart));
  console.log("Preferences:", JSON.parse(prefs));
} finally {
  await browser2.close();
}

// Clean up
await fetch(`${session.stop}&force=true`, { method: "DELETE" });
