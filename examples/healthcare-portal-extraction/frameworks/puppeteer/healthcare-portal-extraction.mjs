// Extracts patient medication records from a sandbox healthcare portal.
//
// Install: npm install puppeteer-core
// Run:     node healthcare-portal-extraction.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/clarity-health/patient-portal', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('#patient-email');
  await page.type('#patient-email', 'patient@example.com');
  await page.type('#patient-password', 'health2025');
  await page.click('#patient-login-submit');

  await page.waitForSelector('#medicationlist');

  const medications = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#medicationlist table tbody tr')).map((row) => {
      const cells = row.querySelectorAll('td');
      return {
        medication: cells[0]?.innerText?.trim() ?? '',
        dosage: cells[1]?.innerText?.trim() ?? '',
        frequency: cells[2]?.innerText?.trim() ?? '',
        prescriber: cells[3]?.innerText?.trim() ?? '',
        refills: cells[4]?.innerText?.trim() ?? '',
      };
    })
  );

  console.log(JSON.stringify(medications, null, 2));
} finally {
  await browser.close();
}
