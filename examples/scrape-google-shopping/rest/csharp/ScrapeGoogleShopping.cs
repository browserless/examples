// Scrapes Google Shopping results using BQL with stealth mode.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}";

var payload = new
{
    query = @"mutation ScrapeGoogleShopping {
      goto(url: ""https://www.google.com/search?q=wireless+headphones&tbm=shop"", waitUntil: networkIdle) { status }
      products: mapSelector(selector: "".sh-dgr__grid-result"") {
        title: mapSelector(selector: ""h3.tAxDx"") { innerText }
        price: mapSelector(selector: "".a8Pemb"") { innerText }
        store: mapSelector(selector: "".aULzUe"") { innerText }
        rating: mapSelector(selector: "".Rsc7Yb"") { innerText }
      }
    }",
    variables = new { },
    operationName = "ScrapeGoogleShopping",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
