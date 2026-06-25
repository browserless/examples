// Logs into a sandbox vendor portal, lists orders, and extracts invoice download links using BQL.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/chromium/bql?token={token}";

var payload = new
{
    query = @"mutation BulkInvoiceDownload {
  goto(url: ""https://scraping-sandbox.netlify.app/harvest-direct/vendor-portal"", waitUntil: networkIdle) {
    status
  }
  waitForForm: waitForSelector(selector: ""form"", timeout: 10000) {
    time
  }
  typeEmail: type(selector: ""input[name=email]"", text: ""demo@example.com"") {
    time
  }
  typePassword: type(selector: ""input[name=password]"", text: ""helloworld"") {
    time
  }
  submitLogin: click(selector: ""button[type=submit]"") {
    time
  }
  waitForOrders: waitForSelector(selector: ""table tbody tr"", timeout: 10000) {
    time
  }
  orders: mapSelector(selector: ""table tbody tr"") {
    orderId: mapSelector(selector: ""td:nth-child(1)"") { innerText }
    date: mapSelector(selector: ""td:nth-child(2)"") { innerText }
    items: mapSelector(selector: ""td:nth-child(3)"") { innerText }
    total: mapSelector(selector: ""td:nth-child(4)"") { innerText }
    status: mapSelector(selector: ""td:nth-child(5)"") { innerText }
    viewLink: mapSelector(selector: ""td a"") {
      href: attribute(name: ""href"") { value }
    }
  }
}",
    variables = new { },
    operationName = "BulkInvoiceDownload",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
