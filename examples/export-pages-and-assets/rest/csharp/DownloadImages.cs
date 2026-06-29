// Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
// using the Browserless /export endpoint.
// Uses System.Net.Http.HttpClient — no packages needed.
//
// Run: dotnet run

using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class DownloadImages
{
    static async Task Main()
    {
        const string token = "YOUR_API_TOKEN_HERE";
        using var client = new HttpClient();

        var body = new StringContent(
            "{\"url\":\"https://scraping-sandbox.netlify.app/harvest-direct\",\"includeResources\":true}",
            Encoding.UTF8,
            "application/json"
        );
        var response = await client.PostAsync(
            $"https://production-sfo.browserless.io/export?token={token}",
            body
        );

        var bytes = await response.Content.ReadAsByteArrayAsync();
        await File.WriteAllBytesAsync("page.zip", bytes);
        Console.WriteLine("Saved page.zip");
    }
}
