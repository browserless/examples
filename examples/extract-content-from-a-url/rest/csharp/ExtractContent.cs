// Fetches the fully rendered HTML of a page using the Browserless /content endpoint.
// Uses System.Net.Http and System.Text.Json from the .NET standard library.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

const string Token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/content?token={Token}";

var payload = new { url = "https://example.com" };

using var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
request.Headers.Add("Cache-Control", "no-cache");
request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

var response = await client.SendAsync(request);
string html = await response.Content.ReadAsStringAsync();
Console.WriteLine(html[..Math.Min(500, html.Length)]);
