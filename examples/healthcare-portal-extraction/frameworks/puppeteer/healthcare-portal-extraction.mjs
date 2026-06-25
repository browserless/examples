// Extracts patient records from a sandbox healthcare portal using BQL.
//
// Install: npm install puppeteer-core
// Run:     node healthcare-portal-extraction.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/clarity-health', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('.patient-record');

  const patients = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.patient-record')).map((record) => ({
      name: record.querySelector('.patient-name')?.innerText?.trim() ?? '',
      dob: record.querySelector('.patient-dob')?.innerText?.trim() ?? '',
      provider: record.querySelector('.patient-provider')?.innerText?.trim() ?? '',
      nextAppt: record.querySelector('.patient-appointment')?.innerText?.trim() ?? '',
      status: record.querySelector('.patient-status')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(patients, null, 2));
} finally {
  await browser.close();
}
