// Creates a Browserless session and closes it via the Session API.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

var token = "YOUR_API_TOKEN_HERE";
var client = new HttpClient();

var content = new StringContent(
    JsonSerializer.Serialize(new { ttl = 60000, stealth = true }),
    Encoding.UTF8,
    "application/json"
);

var response = await client.PostAsync(
    $"https://production-sfo.browserless.io/session?token={token}",
    content
);
var body = await response.Content.ReadAsStringAsync();
var session = JsonSerializer.Deserialize<JsonElement>(body);

var stopUrl = session.GetProperty("stop").GetString();
Console.WriteLine($"Session created: {session.GetProperty("id")}");

var closeResponse = await client.DeleteAsync($"{stopUrl}&force=true");
Console.WriteLine($"Session closed: {closeResponse.StatusCode}");
