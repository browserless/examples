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
      goto(url: ""https://www.walmart.com/search?q=coffee+maker"", waitUntil: networkIdle) { status }
      waitForTimeout(time: 2000) { time }
      products: mapSelector(selector: ""[data-item-id]"") {
        title: mapSelector(selector: ""[data-automation-id='product-title']"") { innerText }
        price: mapSelector(selector: ""[itemprop='price']"") { innerText }
        rating: mapSelector(selector: ""[data-testid='product-ratings']"") { innerText }
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
