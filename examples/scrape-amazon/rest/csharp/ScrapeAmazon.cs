// Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeAmazon {
  goto(url: ""https://www.amazon.com/s?k=wireless+headphones"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ""div.s-result-item[data-asin]"", timeout: 15000) {
    time
  }
  products: mapSelector(selector: ""div.s-result-item[data-asin]"") {
    asin: attribute(name: ""data-asin"") { value }
    title: mapSelector(selector: ""h2 span"") { innerText }
    price: mapSelector(selector: "".a-price .a-offscreen"") { innerText }
    rating: mapSelector(selector: "".a-icon-alt"") { innerText }
    reviewCount: mapSelector(selector: "".a-size-base.s-underline-text"") { innerText }
    link: mapSelector(selector: ""h2 a"") {
      href: attribute(name: ""href"") { value }
    }
  }
}",
    variables = new { },
    operationName = "ScrapeAmazon",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
