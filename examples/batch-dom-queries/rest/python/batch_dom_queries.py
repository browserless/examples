# Runs multiple DOM queries in a single /function request — title, h1, meta description, and links.
# The function runs every query in one browser session, avoiding multiple round-trips.
#
# Install: pip install requests
# Run:     python batch_dom_queries.py

import requests

code = """
export default async ({ page }) => {
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
};
"""

response = requests.post(
    'https://production-sfo.browserless.io/function?token=YOUR_API_TOKEN_HERE',
    headers={'Content-Type': 'application/javascript'},
    data=code.encode('utf-8'),
)

print(response.json())
