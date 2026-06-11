// Generates a PDF from a URL using the Browserless /pdf endpoint.
// Uses System.Net.Http and System.Text.Json from the .NET standard library.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

const string Token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/pdf?token={Token}";

var payload = new
{
    url = "https://example.com",
    options = new { displayHeaderFooter = true, printBackground = true, format = "A4" },
};

using var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
request.Headers.Add("Cache-Control", "no-cache");
request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

var response = await client.SendAsync(request);
var contentStream = await response.Content.ReadAsStreamAsync();
using var fileStream = new FileStream("output.pdf", FileMode.Create, FileAccess.Write);
await contentStream.CopyToAsync(fileStream);
Console.WriteLine("PDF saved as output.pdf.");
