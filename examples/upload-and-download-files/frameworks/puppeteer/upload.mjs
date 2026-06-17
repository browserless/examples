import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

const TOKEN = "YOUR_API_TOKEN_HERE";

const fileToUpload = {
  name: "image.png",
  content: fs
    .readFileSync(path.join(process.cwd(), "image.png"))
    .toString("base64"),
  mimeType: "image/png",
};

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto("https://jimpl.com/");
  await page.waitForSelector("input[type=file]");

  // Browserless.uploadFile sends the bytes over CDP and builds the File in the
  // browser context — no shared filesystem with the remote browser needed.
  const cdp = await page.createCDPSession();
  const result = await cdp.send("Browserless.uploadFile", {
    selector: "input[type=file]",
    files: [fileToUpload],
  });

  console.log(result); // { ok: true }
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
