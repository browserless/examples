// Scrapes Zillow property listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeZillow {
      goto(url: ""https://www.zillow.com/new-york-ny/"", waitUntil: networkIdle) { status }
      waitForTimeout(time: 3000) { time }
      listings: mapSelector(selector: ""[data-test='property-card']"") {
        address: mapSelector(selector: ""[data-test='property-card-addr']"") { innerText }
        price: mapSelector(selector: ""[data-test='property-card-price']"") { innerText }
        details: mapSelector(selector: "".StyledPropertyCardHomeDetails"") { innerText }
      }
    }",
    variables = new { },
    operationName = "ScrapeZillow",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
