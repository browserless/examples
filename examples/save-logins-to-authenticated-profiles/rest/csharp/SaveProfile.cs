// Saves an authenticated browser profile and reuses it across sessions.
// Phase 1 creates a named profile session (use Playwright to log in via CDP).
// Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;

const string Token = "YOUR_API_TOKEN_HERE";
const string Origin = "https://production-sfo.browserless.io";

using var client = new HttpClient();

// Phase 1 – create a named profile session.
var sessionBody = new StringContent("{\"name\": \"my-profile\"}", Encoding.UTF8, "application/json");
var sessionResponse = await client.PostAsync($"{Origin}/profile?token={Token}", sessionBody);
var sessionJson = await sessionResponse.Content.ReadAsStringAsync();
Console.WriteLine("Session: " + sessionJson);
// Parse 'connect' from sessionJson and use Playwright/Puppeteer to log in,
// then call Browserless.saveProfile to persist the session.

// Phase 2 – reuse the saved profile.
var screenshotBody = new StringContent(
    "{\"url\": \"https://app.example.com/dashboard\"}", Encoding.UTF8, "application/json");
var screenshotResponse = await client.PostAsync(
    $"{Origin}/screenshot?token={Token}&profile=my-profile", screenshotBody);
var bytes = await screenshotResponse.Content.ReadAsByteArrayAsync();
await File.WriteAllBytesAsync("dashboard.png", bytes);
Console.WriteLine("Screenshot saved to dashboard.png.");
