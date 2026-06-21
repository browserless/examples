// Routes browser traffic through a residential proxy and logs the resulting IP.
//
// Run: node proxy.mjs

const response = await fetch(
  'https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://api.ipify.org?format=json',
      elements: [{ selector: 'body' }],
    }),
  }
);

const { data } = await response.json();
const ip = JSON.parse(data[0].results[0].text).ip;
console.log('Proxy IP:', ip);
