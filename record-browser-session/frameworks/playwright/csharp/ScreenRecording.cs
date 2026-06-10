// Records a browser session as a .webm file using Browserless CDP commands.
// Must reuse the existing context and page from ConnectOverCDPAsync — creating new ones
// starts a fresh session that isn't wired to the recording.
//
// Install: dotnet add package Microsoft.Playwright && playwright install chromium
// Run:     dotnet run

using Microsoft.Playwright;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

class ScreenRecording
{
    public static async Task Main()
    {
        const string TOKEN = "YOUR_API_TOKEN_HERE";
        string WS_ENDPOINT = $"wss://production-sfo.browserless.io?token={TOKEN}&headless=false&stealth&record=true";

        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.ConnectOverCDPAsync(WS_ENDPOINT);

        // Reuse the existing context and page — new ones won't be wired to the recording.
        var context = browser.Contexts[0];
        var page = context.Pages[0];

        // Set viewport before starting — dimensions are fixed for the entire recording.
        await page.SetViewportSizeAsync(1280, 720);

        var cdpSession = await context.NewCDPSessionAsync(page);
        await cdpSession.SendAsync("Browserless.startRecording");

        await page.GotoAsync("https://example.com");
        await Task.Delay(5000);

        await page.GotoAsync("https://example.com/about");
        await Task.Delay(5000);

        // base64 encoding is required — CDP can't transfer raw binary over its text protocol.
        var response = await cdpSession.SendAsync(
            "Browserless.stopRecording",
            new Dictionary<string, object> { ["encoding"] = "base64" }
        );
        byte[] data = Convert.FromBase64String(response.Value<string>("value"));
        await File.WriteAllBytesAsync("recording.webm", data);

        Console.WriteLine("Recording saved to recording.webm");
        await browser.CloseAsync();
    }
}
