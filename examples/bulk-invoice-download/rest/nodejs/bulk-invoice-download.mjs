// Logs into a sandbox vendor portal, lists orders, and extracts invoice download links using BQL.
//
// Run: node bulk-invoice-download.mjs

const query = `mutation BulkInvoiceDownload {
  goto(url: "https://scraping-sandbox.netlify.app/harvest-direct/vendor-portal", waitUntil: networkIdle) {
    status
  }
  waitForForm: waitForSelector(selector: "form", timeout: 10000) {
    time
  }
  typeEmail: type(selector: "input[name=email]", text: "demo@example.com") {
    time
  }
  typePassword: type(selector: "input[name=password]", text: "helloworld") {
    time
  }
  submitLogin: click(selector: "button[type=submit]") {
    time
  }
  waitForOrders: waitForSelector(selector: "table tbody tr", timeout: 10000) {
    time
  }
  orders: mapSelector(selector: "table tbody tr") {
    orderId: mapSelector(selector: "td:nth-child(1)") { innerText }
    date: mapSelector(selector: "td:nth-child(2)") { innerText }
    items: mapSelector(selector: "td:nth-child(3)") { innerText }
    total: mapSelector(selector: "td:nth-child(4)") { innerText }
    status: mapSelector(selector: "td:nth-child(5)") { innerText }
    viewLink: mapSelector(selector: "td a") {
      href: attribute(name: "href") { value }
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'BulkInvoiceDownload' }),
  }
);

const { data } = await response.json();
const orders = data.orders.map((o) => ({
  orderId: o.orderId?.[0]?.innerText ?? '',
  date: o.date?.[0]?.innerText ?? '',
  total: o.total?.[0]?.innerText ?? '',
  status: o.status?.[0]?.innerText ?? '',
  viewLink: o.viewLink?.[0]?.href?.value ?? '',
}));
console.log(JSON.stringify(orders, null, 2));
