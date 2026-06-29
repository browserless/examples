// Retries a Browserless BQL request with exponential backoff on failure.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/bql?token={token}";

const int maxRetries = 5;
int delayMs = 1000;

var payload = JsonSerializer.Serialize(new
{
    query = @"mutation {
      goto(url: ""https://scraping-sandbox.netlify.app/dashboard"", waitUntil: networkIdle) { status }
      title { title }
    }",
    variables = new { },
});

using HttpClient httpClient = new HttpClient();

for (int attempt = 1; attempt <= maxRetries; attempt++)
{
    try
    {
        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await httpClient.PostAsync(endpoint, content);
        response.EnsureSuccessStatusCode();

        string body = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Success on attempt {attempt}:");
        Console.WriteLine(body);
        return;
    }
    catch (Exception ex)
    {
        if (attempt == maxRetries) throw;
        Console.WriteLine($"Attempt {attempt} failed: {ex.Message}. Retrying in {delayMs}ms...");
        await Task.Delay(delayMs);
        delayMs *= 2;
    }
}
