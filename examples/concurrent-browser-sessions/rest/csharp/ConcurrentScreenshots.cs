// Captures screenshots of multiple pages concurrently using the Browserless REST API.
// Uses System.Net.Http.HttpClient with Task.WhenAll — no extra packages needed.
//
// Run: dotnet run
//
// Note: for production use, replace the string-interpolated JSON body with
// System.Text.Json.JsonSerializer.Serialize to handle URLs containing quotes
// or backslashes safely.

using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class ConcurrentScreenshots
{
    static async Task Main()
    {
        const string token = "YOUR_API_TOKEN_HERE";
        string[] urls =
        {
            "https://example.com/page/1",
            "https://example.com/page/2",
            "https://example.com/page/3",
            "https://example.com/page/4",
            "https://example.com/page/5",
        };

        using var client = new HttpClient();

        await Task.WhenAll(urls.Select(async (url, i) =>
        {
            var body = new StringContent(
                $"{{\"url\":\"{url}\",\"options\":{{\"type\":\"png\",\"fullPage\":true}}}}",
                Encoding.UTF8,
                "application/json"
            );
            var response = await client.PostAsync(
                $"https://production-sfo.browserless.io/screenshot?token={token}",
                body
            );
            var bytes = await response.Content.ReadAsByteArrayAsync();
            await File.WriteAllBytesAsync($"screenshot-{i + 1}.png", bytes);
            Console.WriteLine($"Saved screenshot-{i + 1}.png");
        }));

        Console.WriteLine("All done");
    }
}
