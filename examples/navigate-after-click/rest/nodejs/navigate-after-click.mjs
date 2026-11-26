// Clicks a link and waits for navigation to complete using the /function API.
//
// Run: node navigate-after-click.mjs

const code = `export default async ({ page }) => {
  await page.goto('https://scraping-sandbox.netlify.app/products');

  // Register the navigation wait before clicking — if you click first,
  // the page load can complete before waitForNavigation() starts listening.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('a[href="/contact-us"]'),
  ]);

  const heading = await page.$eval('h1', el => el.textContent.trim());
  return { url: page.url(), heading };
};`;

const response = await fetch(
  'https://production-sfo.browserless.io/function?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/javascript' },
    body: code,
  }
);

const result = await response.json();
console.log(result);
