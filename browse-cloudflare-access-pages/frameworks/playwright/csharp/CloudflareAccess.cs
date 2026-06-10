// Accesses a Cloudflare Access-protected page by injecting Service Token headers
// via ExtraHTTPHeaders on a new context. Headers are sent on every request
// within that context.
//
// Install: dotnet add package Microsoft.Playwright
// Run:     dotnet run

using Microsoft.Playwright;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

class CloudflareAccess
{
    static async Task Main()
    {
        const string TOKEN = "YOUR_API_TOKEN_HERE";
        string WS_ENDPOINT = $"wss://production-sfo.browserless.io?token={TOKEN}";

        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.ConnectOverCDPAsync(WS_ENDPOINT);
        try
        {
            var context = await browser.NewContextAsync(new()
            {
                ExtraHTTPHeaders = new Dictionary<string, string>
                {
                    ["CF-Access-Client-Id"] = "YOUR_CF_CLIENT_ID.access",
                    ["CF-Access-Client-Secret"] = "YOUR_CF_CLIENT_SECRET",
                }
            });
            var page = await context.NewPageAsync();
            await page.GotoAsync("https://internal.example.com/dashboard",
                new() { WaitUntil = WaitUntilState.NetworkIdle });
            Console.WriteLine($"Title: {await page.TitleAsync()}");
            await page.ScreenshotAsync(new() { Path = "dashboard.png" });
        }
        finally
        {
            // Always close to release the session even on error.
            await browser.CloseAsync();
        }
    }
}
