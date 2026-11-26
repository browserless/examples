// Dismisses cookie consent banners via a BQL mutation before capturing a screenshot.
// if returns null (not an error) when the selector is absent — safe on pages with no banner.
//
// For sites covered by major consent platforms (OneTrust, CookieBot, etc.), you can also
// use the simpler blockConsentModals=true query parameter on /screenshot or /pdf instead.
//
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
// Run: node cookies.mjs

import fs from 'fs';

const response = await fetch(
  'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation AcceptCookies {
        # waitUntil: networkIdle ensures the page is fully settled before the if check runs.
        # if returns null (not an error) when the selector is absent, so this is safe on
        # pages with no banner.
        goto(url: "https://www.onetrust.com/", waitUntil: networkIdle) {
          status
        }

        if(selector: "[id*=accept], [class*=accept], button[id*=cookie]", visible: true) {
          acceptBtn: click(selector: "[id*=accept], [class*=accept], button[id*=cookie]") {
            time
          }
          # Give the banner a moment to animate out before the screenshot.
          bannerClosed: waitForTimeout(time: 1000) {
            time
          }
        }

        screenshot {
          base64
        }
      }`,
      operationName: 'AcceptCookies',
    }),
  }
);

const { data } = await response.json();
if (data.screenshot?.base64) {
  fs.writeFileSync('page.png', Buffer.from(data.screenshot.base64, 'base64'));
  console.log('Screenshot saved to page.png');
}
