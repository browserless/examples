// Creates a long-lived Browserless session, connects via Puppeteer to set state,
// disconnects, then reconnects and verifies state persisted.
//
// Install: npm install puppeteer-core
// Run:     node persist-session.mjs

import puppeteer from "puppeteer-core";

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
const browser = await puppeteer.connect({ browserWSEndpoint: session.connect });
try {
  const page = await browser.newPage();
  await page.goto("https://automationexercise.com", { waitUntil: "networkidle2" });

  await page.evaluate(() => {
    localStorage.setItem(
      "shoppingCart",
      JSON.stringify({ items: [{ id: 1, name: "Blue Top" }], totalItems: 1, totalPrice: 500 })
    );
    localStorage.setItem("userPreferences", JSON.stringify({ theme: "dark", language: "en" }));
  });

  console.log("State set. Disconnecting...");
} finally {
  await browser.disconnect();
}

// Reconnect to the same session — state is preserved
const browser2 = await puppeteer.connect({ browserWSEndpoint: session.connect });
try {
  const page2 = await browser2.newPage();
  await page2.goto("https://automationexercise.com", { waitUntil: "networkidle2" });

  const cart = await page2.evaluate(() => localStorage.getItem("shoppingCart"));
  const prefs = await page2.evaluate(() => localStorage.getItem("userPreferences"));

  console.log("Cart:", JSON.parse(cart));
  console.log("Preferences:", JSON.parse(prefs));
} finally {
  await browser2.close();
}

// Clean up
await fetch(`${session.stop}&force=true`, { method: "DELETE" });
