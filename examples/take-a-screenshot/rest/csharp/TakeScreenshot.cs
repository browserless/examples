// Captures a webpage as a PNG using the Browserless /screenshot endpoint.
// Uses System.Net.Http and System.Text.Json from the .NET standard library.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

const string Token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/screenshot?token={Token}";

var payload = new
{
    url = "https://scraping-sandbox.netlify.app/receipt",
    options = new { fullPage = true, type = "png" },
};

using var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
request.Headers.Add("Cache-Control", "no-cache");
request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

var response = await client.SendAsync(request);
var contentStream = await response.Content.ReadAsStreamAsync();
using var fileStream = new FileStream("screenshot.png", FileMode.Create, FileAccess.Write);
await contentStream.CopyToAsync(fileStream);
Console.WriteLine("Screenshot saved as screenshot.png.");
