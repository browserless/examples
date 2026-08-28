// Triggers an email OTP login with BAP, then hands the session off so another
// process can enter the code it received. Reconnect to the logged endpoint from
// wherever you read the inbox, then type the code into the waiting page. The
// reconnect timeout sets how long you have to do it.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node otp.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://app.example.com/login');

  await page.type('input[type=email]', 'user@example.com');
  await page.click('button[type=submit]');
  await page.waitForSelector('input[name=otp], input[autocomplete=one-time-code]');

  // Hand the session off so another process can enter the code it received.
  const { browserQLEndpoint } = await page.reconnect({ timeout: 60000 });
  console.log(browserQLEndpoint);

  // No close() here. Closing would destroy the page holding the OTP field
  // before the inbox reader can reconnect to it.
} catch (error) {
  // Only close when the handoff never happened, so nothing is left stranded.
  await browser.close();
  throw error;
}
