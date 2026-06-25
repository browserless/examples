// Scrapes GitHub trending repositories using BQL.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/chromium/bql?token={token}";

var payload = new
{
    query = @"mutation ScrapeGitHubTrending {
  goto(url: ""https://github.com/trending"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ""article.Box-row"", timeout: 15000) {
    time
  }
  repos: mapSelector(selector: ""article.Box-row"") {
    name: mapSelector(selector: ""h2 a"") { innerText }
    description: mapSelector(selector: ""p"") { innerText }
    language: mapSelector(selector: ""[itemprop=programmingLanguage]"") { innerText }
    stars: mapSelector(selector: ""a[href*=stargazers]"") { innerText }
    forks: mapSelector(selector: ""a[href*=forks]"") { innerText }
    todayStars: mapSelector(selector: ""span.d-inline-block.float-sm-right"") { innerText }
  }
}",
    variables = new { },
    operationName = "ScrapeGitHubTrending",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
