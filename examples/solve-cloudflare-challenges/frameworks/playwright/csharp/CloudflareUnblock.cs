// Bypasses Cloudflare challenges via /unblock, then connects Playwright to the
// already-unblocked session using the returned browserWSEndpoint.
// The ttl parameter keeps the browser alive long enough for the client to connect.
//
// Install: dotnet add package Microsoft.Playwright
// Run:     dotnet run

using Microsoft.Playwright;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class CloudflareUnblock
{
    static async Task Main()
    {
        const string TOKEN = "YOUR_API_TOKEN_HERE";
        using var httpClient = new HttpClient();

        var body = new StringContent(
            "{\"url\":\"https://example-cloudflare-protected.com\",\"browserWSEndpoint\":true,\"ttl\":30000}",
            Encoding.UTF8, "application/json");
        var res = await httpClient.PostAsync(
            $"https://production-sfo.browserless.io/unblock?token={TOKEN}&proxy=residential",
            body);

        using var json = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        // The /unblock response returns a raw WebSocket URL — append the token before connecting.
        string wsEndpoint = json.RootElement.GetProperty("browserWSEndpoint").GetString()
            + $"?token={TOKEN}";

        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.ConnectOverCDPAsync(wsEndpoint);
        try
        {
            var context = browser.Contexts[0];
            var page = context.Pages[0];
            Console.WriteLine($"Title: {await page.TitleAsync()}");
            Console.WriteLine($"URL: {page.Url}");
        }
        finally
        {
            // Always close to release the session even on error.
            await browser.CloseAsync();
        }
    }
}
