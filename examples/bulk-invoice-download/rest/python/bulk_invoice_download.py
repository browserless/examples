# Logs into a sandbox vendor portal, lists orders, and extracts invoice download links using BQL.
#
# Install: pip install requests
# Run:     python bulk_invoice_download.py

import requests

query = """
mutation BulkInvoiceDownload {
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
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/chromium/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'BulkInvoiceDownload'},
)

data = response.json()['data']
for order in data['orders']:
    oid = order['orderId'][0]['innerText'] if order['orderId'] else ''
    date = order['date'][0]['innerText'] if order['date'] else ''
    total = order['total'][0]['innerText'] if order['total'] else ''
    status = order['status'][0]['innerText'] if order['status'] else ''
    print(f'{oid} | {date} | {total} | {status}')
