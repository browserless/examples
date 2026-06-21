// Creates a long-lived Browserless session, connects to set state, disconnects,
// then reconnects to verify the state persists.
//
// Install: npm install puppeteer-core
// Run:     node persist-session.mjs

import puppeteer from "puppeteer-core";

const TOKEN = "YOUR_API_TOKEN_HERE";

// Step 1: Create a long-lived session
const sessionResponse = await fetch(
  `https://production-sfo.browserless.io/session?token=${TOKEN}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ttl: 300000, stealth: true, headless: false }),
  }
);
const session = await sessionResponse.json();
console.log("Session created:", session.id);

// Step 2: Connect via Puppeteer and store data
const browser = await puppeteer.connect({ browserWSEndpoint: session.connect });
const page = await browser.newPage();

await page.goto("https://automationexercise.com", { waitUntil: "networkidle2" });

await page.evaluate(() => {
  localStorage.setItem(
    "shoppingCart",
    JSON.stringify({ items: [{ id: 1 }], totalItems: 1, totalPrice: 500 })
  );
  localStorage.setItem("userPreferences", JSON.stringify({ theme: "dark" }));
});

await browser.disconnect();
console.log("State set. Disconnected.");

// Step 3: Reconnect and verify state persists
const browser2 = await puppeteer.connect({ browserWSEndpoint: session.connect });
const page2 = await browser2.newPage();
await page2.goto("https://automationexercise.com", { waitUntil: "networkidle2" });

const cart = await page2.evaluate(() => localStorage.getItem("shoppingCart"));
console.log("Cart persisted:", JSON.parse(cart));

await browser2.close();

// Step 4: Delete the session
await fetch(`${session.stop}&force=true`, { method: "DELETE" });
console.log("Session stopped.");
