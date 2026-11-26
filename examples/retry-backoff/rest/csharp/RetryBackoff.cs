// Retries a Browserless /screenshot request with exponential backoff on failure.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/screenshot?token={token}";

var payload = JsonSerializer.Serialize(new { url = "https://scraping-sandbox.netlify.app/dashboard" });
int retries = 3;
int baseDelay = 500;

using HttpClient httpClient = new HttpClient();
HttpResponseMessage response = null;

for (int attempt = 0; attempt <= retries; attempt++)
{
    var content = new StringContent(payload, Encoding.UTF8, "application/json");
    response = await httpClient.PostAsync(endpoint, content);

    if ((int)response.StatusCode == 429)
    {
        if (attempt == retries) throw new Exception("Browserless over capacity after retries");
        await Task.Delay(baseDelay * (int)Math.Pow(2, attempt));
        continue;
    }
    break;
}

byte[] bytes = await response.Content.ReadAsByteArrayAsync();
Console.WriteLine($"Status: {(int)response.StatusCode}, Body: {bytes.Length} bytes");
