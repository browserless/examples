import fs from "fs";
import path from "path";
import { chromium } from "playwright-core";

const TOKEN = "YOUR_API_TOKEN_HERE";

const fileToUpload = {
  name: "image.png",
  content: fs
    .readFileSync(path.join(process.cwd(), "image.png"))
    .toString("base64"),
  mimeType: "image/png",
};

// connectOverCDP uses the raw CDP endpoint, which is where Browserless injects
// the custom Browserless.* methods — the Playwright protocol server does not.
const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`,
);

try {
  const context = browser.contexts()[0];
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto("https://jimpl.com/");
  await page.waitForSelector("input[type=file]");

  const cdp = await context.newCDPSession(page);
  const result = await cdp.send("Browserless.uploadFile", {
    selector: "input[type=file]",
    files: [fileToUpload],
  });

  console.log(result); // { ok: true }
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
