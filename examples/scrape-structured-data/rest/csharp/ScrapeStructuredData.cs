// Extracts structured data from a page using the Browserless /scrape endpoint.
// Uses System.Net.Http and System.Text.Json from the .NET standard library.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

const string Token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/scrape?token={Token}";

var payload = new
{
    url = "https://example.com",
    elements = new[] { new { selector = "h1" }, new { selector = "p" } },
};

using var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

var response = await client.SendAsync(request);
string responseBody = await response.Content.ReadAsStringAsync();
Console.WriteLine(responseBody);
