import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

const TOKEN = "YOUR_API_TOKEN_HERE";

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();

  // Off by default — download bytes count against data transfer, so opt in.
  await cdp.send("Browserless.setDownloadEnabled", { enabled: true });

  // Register before the click so the completed download can't be missed.
  cdp.on("Browserless.fileDownloaded", ({ filename, data }) => {
    const buffer = Buffer.from(data, "base64");
    fs.writeFileSync(path.join(process.cwd(), filename), buffer);
    console.log(`saved: ${filename} (${buffer.length} bytes)`);
  });

  await page.goto("https://scraping-sandbox.netlify.app/downloadsamples");
  await page.click('a[href="/samples/sample.json"]');

  // Give the download time to finish before closing the connection.
  await new Promise((res) => setTimeout(res, 3000));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
