// Scrapes Yelp business listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeYelp {
  goto(url: ""https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ""[data-testid=serp-ia-card]"", timeout: 15000) {
    time
  }
  businesses: mapSelector(selector: ""[data-testid=serp-ia-card]"") {
    name: mapSelector(selector: ""a[class*=businessName] span"") { innerText }
    rating: mapSelector(selector: ""[aria-label*=star]"") {
      ratingLabel: attribute(name: ""aria-label"") { value }
    }
    reviewCount: mapSelector(selector: ""span[class*=reviewCount]"") { innerText }
    categories: mapSelector(selector: ""a[class*=categoryLink]"") { innerText }
    priceRange: mapSelector(selector: ""span[class*=priceRange]"") { innerText }
  }
}",
    variables = new { },
    operationName = "ScrapeYelp",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
