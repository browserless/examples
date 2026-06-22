// Scrapes Reddit posts from a subreddit using BQL with stealth mode.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}";

var payload = new
{
    query = @"mutation ScrapeReddit {
      goto(url: ""https://www.reddit.com/r/programming/"", waitUntil: networkIdle) { status }
      waitForTimeout(time: 2000) { time }
      posts: mapSelector(selector: ""article"") {
        title: mapSelector(selector: ""[id*='post-title']"") { innerText }
        score: mapSelector(selector: ""[id*='vote-arrows']"") { innerText }
        comments: mapSelector(selector: ""a[data-click-id='comments']"") { innerText }
      }
    }",
    variables = new { },
    operationName = "ScrapeReddit",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
