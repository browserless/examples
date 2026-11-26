// Scrapes real estate agent names and profile URLs from a Zillow agent directory using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxySticky=true&proxyCountry=us&humanlike=true&blockAds=true";

var payload = new
{
    query = @"mutation ScrapeZillow {
      goto(url: ""https://www.zillow.com/professionals/real-estate-agent-reviews/new-york-ny/"", waitUntil: networkIdle) { status }
      waitForTimeout(time: 3000) { time }
      agents: mapSelector(selector: ""a[href*='/profile/']"") {
        name: mapSelector(selector: ""h2"") { innerText }
        profileUrl: attribute(name: ""href"") { value }
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
