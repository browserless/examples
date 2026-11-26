// Scrapes Reddit posts from a subreddit using BQL with stealth mode.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeRedditPosts {
      goto(url: ""https://www.reddit.com/r/programming/"", waitUntil: domContentLoaded) { status }
      waitForSelector(selector: ""shreddit-post"", timeout: 15000) { time }
      posts: mapSelector(selector: ""shreddit-post"") {
        title: attribute(name: ""post-title"") { value }
        score: attribute(name: ""score"") { value }
        commentCount: attribute(name: ""comment-count"") { value }
        permalink: attribute(name: ""permalink"") { value }
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
