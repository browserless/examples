import { chromium } from "playwright-core";

const TOKEN = "YOUR_API_TOKEN_HERE";

// Playwright's download handling works natively against remote browsers, so it
// connects to the Playwright protocol server rather than the raw CDP endpoint.
const browser = await chromium.connect(
  `wss://production-sfo.browserless.io/chromium/playwright?token=${TOKEN}`,
);

try {
  const page = await browser.newPage();
  await page.goto("https://scraping-sandbox.netlify.app/downloadsamples");

  // Register before clicking so the download can't be missed.
  const downloadPromise = page.waitForEvent("download");
  await page.click('a[href="/samples/sample.json"]');
  const download = await downloadPromise;

  // Saves on the machine running this script, not the remote browser.
  await download.saveAs(download.suggestedFilename());
  console.log(`saved: ${download.suggestedFilename()}`);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
