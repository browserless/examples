// Scrapes Google Shopping results using BQL with stealth mode.
//
// Run: node scrape-google-shopping.mjs

const query = `mutation ScrapeGoogleShopping {
  goto(url: "https://www.google.com/search?q=wireless+headphones&tbm=shop", waitUntil: networkIdle) {
    status
  }
  products: mapSelector(selector: ".sh-dgr__grid-result") {
    title: mapSelector(selector: "h3.tAxDx") {
      innerText
    }
    price: mapSelector(selector: ".a8Pemb") {
      innerText
    }
    store: mapSelector(selector: ".aULzUe") {
      innerText
    }
    rating: mapSelector(selector: ".Rsc7Yb") {
      innerText
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeGoogleShopping' }),
  }
);

const { data } = await response.json();
const products = data.products.map((p) => ({
  title: p.title?.[0]?.innerText ?? '',
  price: p.price?.[0]?.innerText ?? '',
  store: p.store?.[0]?.innerText ?? '',
  rating: p.rating?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(products, null, 2));
