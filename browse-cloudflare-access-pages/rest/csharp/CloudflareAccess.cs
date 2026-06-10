// Two approaches for accessing Cloudflare Access-protected pages via the REST API:
//   1. Saved profile — reuse a browser session captured after logging in through CF Access.
//   2. Service Token — inject CF-Access headers via setExtraHTTPHeaders for machine-to-machine access.
//
// Uses System.Net.Http.HttpClient and System.Text.Json — no packages needed.
//
// Run: dotnet run

using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class CloudflareAccess
{
    static async Task Main()
    {
        const string token = "YOUR_API_TOKEN_HERE";
        using var client = new HttpClient();

        // Approach 1: reuse a saved authenticated profile.
        var profileBody = new StringContent(
            "{\"url\":\"https://internal.example.com/dashboard\"}",
            Encoding.UTF8, "application/json");
        var profileRes = await client.PostAsync(
            $"https://production-sfo.browserless.io/screenshot?token={token}&profile=cf-access-profile",
            profileBody);
        await File.WriteAllBytesAsync("dashboard.png", await profileRes.Content.ReadAsByteArrayAsync());
        Console.WriteLine("Saved dashboard.png");

        // Approach 2: inject Service Token headers via setExtraHTTPHeaders.
        var payload = JsonSerializer.Serialize(new
        {
            url = "https://internal.example.com/dashboard",
            setExtraHTTPHeaders = new Dictionary<string, string>
            {
                ["CF-Access-Client-Id"] = "YOUR_CF_CLIENT_ID.access",
                ["CF-Access-Client-Secret"] = "YOUR_CF_CLIENT_SECRET",
            }
        });
        var tokenBody = new StringContent(payload, Encoding.UTF8, "application/json");
        var tokenRes = await client.PostAsync(
            $"https://production-sfo.browserless.io/content?token={token}",
            tokenBody);
        string content = await tokenRes.Content.ReadAsStringAsync();
        Console.WriteLine(content[..Math.Min(200, content.Length)]);
    }
}
