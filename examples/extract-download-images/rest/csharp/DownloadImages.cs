// Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
// then downloads each image to an images/ directory.
// Uses System.Net.Http.HttpClient and System.Text.Json — no packages needed.
//
// Run: dotnet run

using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class DownloadImages
{
    static async Task Main()
    {
        const string token = "YOUR_API_TOKEN_HERE";
        using var client = new HttpClient();

        var body = new StringContent(
            "{\"url\":\"https://example.com\",\"elements\":[{\"selector\":\"img\",\"timeout\":5000}]}",
            Encoding.UTF8,
            "application/json"
        );
        var scrapeRes = await client.PostAsync(
            $"https://production-sfo.browserless.io/scrape?token={token}",
            body
        );

        using var json = JsonDocument.Parse(await scrapeRes.Content.ReadAsStringAsync());
        var results = json.RootElement.GetProperty("data")[0].GetProperty("results");

        Directory.CreateDirectory("images");
        int i = 0;

        foreach (var result in results.EnumerateArray())
        {
            foreach (var attr in result.GetProperty("attributes").EnumerateArray())
            {
                string name = attr.GetProperty("name").GetString();
                string value = attr.GetProperty("value").GetString();

                if (name == "src" && value.StartsWith("http"))
                {
                    var bytes = await client.GetByteArrayAsync(value);
                    // Use the URL's file extension; fall back to .jpg for extensionless paths.
                    string ext = Path.GetExtension(new Uri(value).AbsolutePath) is { Length: > 0 } e ? e : ".jpg";
                    string filename = $"images/image-{i}{ext}";
                    await File.WriteAllBytesAsync(filename, bytes);
                    Console.WriteLine($"Saved {filename}");
                    i++;
                }
            }
        }
    }
}
