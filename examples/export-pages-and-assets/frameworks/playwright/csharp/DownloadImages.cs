// Exports a page's HTML and linked assets (CSS, JS, images) to a local directory
// by intercepting network responses as the page loads.
//
// Install: dotnet add package Microsoft.Playwright && playwright install chromium
// Run:     dotnet run

using Microsoft.Playwright;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

class DownloadImages
{
    static async Task Main()
    {
        const string TOKEN = "YOUR_API_TOKEN_HERE";
        string WS_ENDPOINT = $"wss://production-sfo.browserless.io?token={TOKEN}";

        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.ConnectOverCDPAsync(WS_ENDPOINT);

        try
        {
            var context = browser.Contexts[0];
            var page = await context.NewPageAsync();
            var assetTasks = new List<Task<(string url, byte[] buf)?>>();

            page.Response += (_, response) =>
            {
                var type = response.Request.ResourceType;
                if (type is "stylesheet" or "script" or "image" or "font")
                {
                    var url = response.Url;
                    assetTasks.Add(response.BodyAsync()
                        .ContinueWith(t => t.IsCompletedSuccessfully
                            ? ((string, byte[])?) (url, t.Result)
                            : null));
                }
            };

            await page.GotoAsync("https://example.com",
                new() { WaitUntil = WaitUntilState.NetworkIdle });

            var html = await page.ContentAsync();
            var assets = (await Task.WhenAll(assetTasks)).Where(a => a.HasValue).Select(a => a!.Value);

            Directory.CreateDirectory("page");
            await File.WriteAllTextAsync("page/index.html", html);
            Console.WriteLine("Saved page/index.html");

            int i = 0;
            foreach (var (url, buf) in assets)
            {
                string ext = Path.GetExtension(new Uri(url).AbsolutePath);
                string filename = $"page/asset-{i}{ext}";
                await File.WriteAllBytesAsync(filename, buf);
                Console.WriteLine($"Saved {filename}");
                i++;
            }
        }
        finally
        {
            await browser.CloseAsync();
        }
    }
}
