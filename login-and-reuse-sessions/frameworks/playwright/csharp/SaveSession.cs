// Logs in once and reuses that authenticated state across future sessions.
// ConnectOverCDPAsync is required for Browserless.saveProfile — ConnectAsync does not expose CDP sessions.
//
// Install: dotnet add package Microsoft.Playwright
// Run:     dotnet run

using Microsoft.Playwright;
using System.Net.Http;
using System.Text;
using System.Text.Json;

const string Token = "YOUR_API_TOKEN_HERE";
const string Origin = "https://production-sfo.browserless.io";

using var http = new HttpClient();

// Phase 1 – create a named profile session and log in.
var sessionBody = new StringContent("{\"name\": \"my-profile\"}", Encoding.UTF8, "application/json");
var sessionResp = await http.PostAsync($"{Origin}/profile?token={Token}", sessionBody);
var sessionJson = JsonDocument.Parse(await sessionResp.Content.ReadAsStringAsync());
var wsEndpoint = sessionJson.RootElement.GetProperty("connect").GetString();

using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.ConnectOverCDPAsync(wsEndpoint);
try
{
    var context = browser.Contexts[0];
    var page = await context.NewPageAsync();
    await page.GotoAsync("https://app.example.com/login");
    await page.FillAsync("#email", "user@example.com");
    await page.FillAsync("#password", Environment.GetEnvironmentVariable("PASSWORD"));
    await page.ClickAsync("button[type='submit']");
    await page.WaitForURLAsync("**/dashboard");

    // CDP command must be sent after navigation completes so all cookies are written.
    var cdp = await page.Context.NewCDPSessionAsync(page);
    var result = await cdp.SendAsync(
        "Browserless.saveProfile",
        new Dictionary<string, object> { ["name"] = "my-profile" }
    );
    Console.WriteLine(result);
    // { ok: true, profileId: '<id>', name: 'my-profile', cookieCount: 12, originCount: 1 }
}
finally
{
    // Always close to release the session even on error.
    await browser.CloseAsync();
}

// Phase 2 – reuse the saved profile.
var browser2 = await playwright.Chromium.ConnectOverCDPAsync(
    $"wss://production-sfo.browserless.io?token={Token}&profile=my-profile");
try
{
    var context = browser2.Contexts[0];
    var page = context.Pages[0];
    await page.GotoAsync("https://app.example.com/dashboard"); // already logged in
    Console.WriteLine($"Title: {await page.TitleAsync()}");
}
finally
{
    // Always close to release the session even on error.
    await browser2.CloseAsync();
}
