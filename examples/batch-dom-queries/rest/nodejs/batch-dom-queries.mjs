// Runs multiple DOM queries in a single /function request — title, h1, meta description, and links.
// The function runs every query in one browser session, avoiding multiple round-trips.
//
// Run: node batch-dom-queries.mjs

const code = `export default async ({ page }) => {
  await page.goto('https://scraping-sandbox.netlify.app/products');

  const data = await page.evaluate(() => ({
    title: document.title,
    heading: document.querySelector('h1')?.textContent?.trim() ?? null,
    links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
      text: a.textContent.trim(),
      href: a.href,
    })),
    productCount: document.querySelectorAll('.product-title').length,
  }));

  return data;
};`;

const response = await fetch(
  'https://production-sfo.browserless.io/function?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/javascript' },
    body: code,
  }
);

const data = await response.json();
console.log(data);
