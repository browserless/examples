// Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeRealtor {
      goto(url: ""https://www.realtor.com/realestateandhomes-search/San-Francisco_CA"", waitUntil: domContentLoaded) { status }
      waitForSelector(selector: ""[data-testid=property-card]"", timeout: 15000) { time }
      properties: mapSelector(selector: ""[data-testid=property-card]"") {
        price: mapSelector(selector: "".fs_700"") { innerText }
        address: mapSelector(selector: ""a .sr_true"") { innerText }
        beds: mapSelector(selector: ""[data-testid=property-meta-beds] [data-testid=meta-value]"") { innerText }
        baths: mapSelector(selector: ""[data-testid=property-meta-baths] [data-testid=meta-value]"") { innerText }
        sqft: mapSelector(selector: ""[data-testid=property-meta-sqft] [data-testid=meta-value]"") { innerText }
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
