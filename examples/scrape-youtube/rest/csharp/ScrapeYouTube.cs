// Scrapes title, channel, views, likes, and upload date from a YouTube video page using BQL with stealth mode.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}";

var payload = new
{
    query = @"mutation ScrapeYouTubeVideo {
      goto(url: ""https://www.youtube.com/watch?v=dQw4w9WgXcQ"", waitUntil: domContentLoaded) { status }
      waitForSelector(selector: ""#view-count[aria-label]"", timeout: 20000) { time }
      title: text(selector: ""h1.ytd-watch-metadata yt-formatted-string"") { text }
      channel: text(selector: ""ytd-channel-name yt-formatted-string a"") { text }
      views: mapSelector(selector: ""#view-count"") { label: attribute(name: ""aria-label"") { value } }
      likes: mapSelector(selector: ""#top-level-buttons-computed like-button-view-model button"") { label: attribute(name: ""aria-label"") { value } }
      uploadDate: text(selector: ""#info-strings yt-formatted-string"") { text }
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
