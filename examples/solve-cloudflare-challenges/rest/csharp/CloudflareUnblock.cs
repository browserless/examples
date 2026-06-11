// Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
// proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
// harder to bypass from datacenter IPs.
//
// Uses System.Net.Http.HttpClient and System.Text.Json — no packages needed.
// Run: dotnet run

using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class CloudflareUnblock
{
    static async Task Main()
    {
        const string token = "YOUR_API_TOKEN_HERE";
        using var client = new HttpClient();

        var body = new StringContent(
            "{\"url\":\"https://example-cloudflare-protected.com\","
            + "\"content\":true,\"cookies\":false,\"screenshot\":false,\"browserWSEndpoint\":false}",
            Encoding.UTF8, "application/json");

        var res = await client.PostAsync(
            $"https://production-sfo.browserless.io/unblock?token={token}&proxy=residential",
            body);

        using var json = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        string content = json.RootElement.GetProperty("content").GetString();
        Console.WriteLine(content[..Math.Min(500, content.Length)]);
    }
}
