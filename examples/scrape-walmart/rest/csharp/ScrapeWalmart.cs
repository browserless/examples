// Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeWalmart {
      goto(url: ""https://www.walmart.com/search?q=iphone"", waitUntil: domContentLoaded) { status }
      waitForTimeout(time: 3000) { time }
      products: mapSelector(selector: ""[data-item-id]"") {
        name: mapSelector(selector: ""[data-automation-id='product-title']"") { innerText }
        price: mapSelector(selector: ""[data-testid='unified-global-product-price-a11y-text']"") { innerText }
        rating: mapSelector(selector: ""[data-testid='product-ratings']"") { innerText }
        reviewCount: mapSelector(selector: ""[data-testid='product-reviews']"") { innerText }
        link: mapSelector(selector: ""a[href*='/ip/']"") { href: attribute(name: ""href"") { value } }
      }
    }",
    variables = new { },
    operationName = "ScrapeWalmart",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
