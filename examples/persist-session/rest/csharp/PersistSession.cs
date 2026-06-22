// Creates a long-lived Browserless session and demonstrates persisting state across connections.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

var token = "YOUR_API_TOKEN_HERE";
var client = new HttpClient();

var content = new StringContent(
    JsonSerializer.Serialize(new { ttl = 300000, stealth = true, headless = false }),
    Encoding.UTF8,
    "application/json"
);

var response = await client.PostAsync(
    $"https://production-sfo.browserless.io/session?token={token}",
    content
);
var body = await response.Content.ReadAsStringAsync();
var session = JsonSerializer.Deserialize<JsonElement>(body);

var connectUrl = session.GetProperty("connect").GetString();
var stopUrl = session.GetProperty("stop").GetString();
Console.WriteLine($"Session created: {session.GetProperty("id")}");
Console.WriteLine($"Connect URL: {connectUrl}");

// Stop the session when done
await client.DeleteAsync($"{stopUrl}&force=true");
Console.WriteLine("Session stopped.");
