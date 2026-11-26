// Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeOpenTable {
      goto(url: ""https://www.opentable.com/s?term=italian&covers=2"", waitUntil: domContentLoaded) { status }
      waitForSelector(selector: ""[data-test=restaurant-card]:has(h6)"", timeout: 15000) { time }
      restaurants: mapSelector(selector: ""[data-test=restaurant-card]:has(h6)"") {
        name: mapSelector(selector: ""h6"") { innerText }
        summary: mapSelector(selector: ""[data-testid=search-list-card-content-container] > div:nth-child(2)"") { innerText }
        cuisine: mapSelector(selector: ""[aria-label^=Price] + span"") { innerText }
        priceRange: mapSelector(selector: ""[aria-label^=Price]"") { innerText }
        bookingsToday: mapSelector(selector: ""[data-testid=icSocialProof] + span"") { innerText }
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
