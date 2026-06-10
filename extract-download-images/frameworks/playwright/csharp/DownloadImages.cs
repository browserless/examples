// Extracts all <img> src URLs from the fully rendered DOM, then downloads each
// image to an images/ directory. Useful when images are lazy-loaded or injected
// by JavaScript after initial page load.
//
// Install: dotnet add package Microsoft.Playwright && playwright install chromium
// Run:     dotnet run

using Microsoft.Playwright;
using System;
using System.IO;
using System.Net.Http;
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
            // Use the default context — creating a new one doesn't inherit launch settings.
            var context = browser.Contexts[0];
            var page = await context.NewPageAsync();
            await page.GotoAsync("https://example.com",
                new() { WaitUntil = WaitUntilState.NetworkIdle });

            var imageUrls = await page.EvaluateAsync<string[]>("""
                Array.from(document.querySelectorAll('img'))
                  .map(img => img.src)
                  .filter(src => src.startsWith('http'))
            """);

            Console.WriteLine($"Found {imageUrls.Length} images");
            Directory.CreateDirectory("images");

            using var client = new HttpClient();
            for (int i = 0; i < imageUrls.Length; i++)
            {
                var bytes = await client.GetByteArrayAsync(imageUrls[i]);
                // Use the URL's file extension; fall back to .jpg for extensionless paths.
                string ext = Path.GetExtension(new Uri(imageUrls[i]).AbsolutePath) is { Length: > 0 } e ? e : ".jpg";
                string filename = $"images/image-{i}{ext}";
                await File.WriteAllBytesAsync(filename, bytes);
                Console.WriteLine($"Saved {filename}");
            }
        }
        finally
        {
            // Always close to release the session even on error.
            await browser.CloseAsync();
        }
    }
}
