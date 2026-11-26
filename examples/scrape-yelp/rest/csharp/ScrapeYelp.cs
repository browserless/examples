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
      goto(url: ""https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY"", waitUntil: domContentLoaded) { status }
      waitForSelector(selector: ""[data-testid=serp-ia-card]"", timeout: 15000) { time }
      businesses: mapSelector(selector: ""[data-testid=serp-ia-card]"") {
        name: mapSelector(selector: ""[class*=businessName] a"") { innerText }
        rating: mapSelector(selector: ""[aria-label*=star]"") {
          ratingLabel: attribute(name: ""aria-label"") { value }
        }
        reviewCount: mapSelector(selector: ""[data-traffic-crawl-id=SearchResultBizRating] span:last-child"") { innerText }
        categories: mapSelector(selector: ""[data-testid=services-actions-component] a[href*=find_desc]"") { innerText }
        priceRange: mapSelector(selector: ""[class*=icon--16-marker] + span + span:not([data-font-weight])"") { innerText }
      }
    }",
    variables = new { },
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
