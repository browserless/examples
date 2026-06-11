// Two approaches for accessing Cloudflare Access-protected pages with Puppeteer:
//   1. Service Token — inject CF-Access headers before navigation.
//   2. Saved profile — reuse a browser session captured after logging in through CF Access.
//
// Install: npm install puppeteer-core
// Run:     node cf-access.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

// Approach 1: inject Service Token headers.
// Headers must be set before navigation — each request to a CF Access-protected
// origin requires them.
{
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
  });
  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'CF-Access-Client-Id': 'YOUR_CF_CLIENT_ID.access',
      'CF-Access-Client-Secret': 'YOUR_CF_CLIENT_SECRET',
    });
    await page.goto('https://internal.example.com/dashboard', {
      waitUntil: 'networkidle2',
    });
    console.log('Title:', await page.title());
  } finally {
    // Always close to release the session even on error.
    await browser.close();
  }
}

// Approach 2: reuse a saved authenticated profile.
{
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}&profile=cf-access-profile`,
  });
  try {
    const page = await browser.newPage();
    await page.goto('https://internal.example.com/dashboard');
    console.log('Title:', await page.title());
  } finally {
    // Always close to release the session even on error.
    await browser.close();
  }
}
