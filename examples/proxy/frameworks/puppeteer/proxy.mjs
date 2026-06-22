// Routes browser traffic through a residential proxy using Puppeteer.
// The proxy is configured at the connection level — all pages share the same proxy IP.
//
// Install: npm install puppeteer-core
// Run:     node proxy.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://api.ipify.org?format=json', { waitUntil: 'networkidle2' });
  const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
  console.log('Proxy IP:', ip);
} finally {
  await browser.close();
}
