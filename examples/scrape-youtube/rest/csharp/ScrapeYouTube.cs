// Scrapes YouTube search results using BQL with stealth mode.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}";

var payload = new
{
    query = @"mutation ScrapeYouTube {
      goto(url: ""https://www.youtube.com/results?search_query=javascript+tutorial"", waitUntil: networkIdle) { status }
      waitForTimeout(time: 2000) { time }
      videos: mapSelector(selector: ""ytd-video-renderer"") {
        title: mapSelector(selector: ""#video-title"") { innerText }
        channel: mapSelector(selector: ""[id='channel-name']"") { innerText }
        views: mapSelector(selector: ""span.inline-metadata-item"") { innerText }
      }
    }",
    variables = new { },
    operationName = "ScrapeYouTube",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
