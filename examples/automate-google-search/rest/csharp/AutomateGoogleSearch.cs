// Searches Google and extracts result headings using the Browserless /scrape endpoint.
// Uses System.Net.Http and System.Text.Json from the .NET standard library.
// Note: Google may block or CAPTCHA this request — use BQL for more reliable results.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Linq;

const string Token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/scrape?token={Token}";

var payload = new
{
    url = "https://www.google.com/search?q=Browserless+headless+browser",
    elements = new[] { new { selector = "h3" } },
};

using var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

var response = await client.SendAsync(request);
string responseBody = await response.Content.ReadAsStringAsync();

var json = JsonDocument.Parse(responseBody);
var results = json.RootElement.GetProperty("data")[0].GetProperty("results");
var titles = results.EnumerateArray()
    .Select(r => r.GetProperty("text").GetString())
    .ToList();
Console.WriteLine(string.Join(", ", titles));
