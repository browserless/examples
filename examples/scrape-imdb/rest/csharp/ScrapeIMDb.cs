// Scrapes IMDb top movie ratings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeIMDb {
  goto(url: ""https://www.imdb.com/chart/top/"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "".ipc-metadata-list-summary-item"", timeout: 15000) {
    time
  }
  movies: mapSelector(selector: "".ipc-metadata-list-summary-item"") {
    title: mapSelector(selector: "".ipc-title__text"") { innerText }
    metadata: mapSelector(selector: "".cli-title-metadata span"") { innerText }
    rating: mapSelector(selector: "".ipc-rating-star--imdb"") {
      ratingLabel: attribute(name: ""aria-label"") { value }
    }
  }
}",
    variables = new { },
    operationName = "ScrapeIMDb",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
