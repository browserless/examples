// Connects to Browserless with solveCaptchas=true and waits for the
// Browserless.captchaAutoSolved CDP event before submitting the form.
//
// Reuse the existing page from the default context so Browserless CDP events
// (including captchaAutoSolved) are visible on this page object. Register the
// CDP listener before navigation so the event isn't missed if the CAPTCHA solves
// immediately after the page loads.
//
// Install: dotnet add package Microsoft.Playwright
// Run:     dotnet run

using Microsoft.Playwright;
using System;
using System.Threading.Tasks;

const string WsEndpoint =
    "wss://production-sfo.browserless.io/stealth"
    + "?token=YOUR_API_TOKEN_HERE"
    + "&proxy=residential&proxyCountry=us"
    + "&solveCaptchas=true&timeout=300000";

using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.ConnectOverCDPAsync(WsEndpoint);

try
{
    // Reuse the existing page from the default context so Browserless CDP
    // events (including captchaAutoSolved) are visible on this page object.
    var context = browser.Contexts[0];
    var page = context.Pages[0];
    var cdp = await page.Context.NewCDPSessionAsync(page);

    // Register before navigation so the event isn't missed if the CAPTCHA
    // solves immediately after the page loads.
    var captchaSolved = new TaskCompletionSource<bool>();
    cdp.On("Browserless.captchaAutoSolved", e => captchaSolved.TrySetResult(true));

    await page.GotoAsync(
        "https://www.google.com/recaptcha/api2/demo",
        new PageGotoOptions { WaitUntil = WaitUntilState.NetworkIdle }
    );

    // Await the CDP event rather than a fixed timeout — fires when Browserless
    // finishes solving the CAPTCHA, not after an arbitrary number of seconds.
    // Compare completed task to timeoutTask so the exception is observed and thrown.
    var timeoutTask = Task.Delay(TimeSpan.FromSeconds(30));
    var completed = await Task.WhenAny(captchaSolved.Task, timeoutTask);
    if (completed == timeoutTask)
        throw new TimeoutException("CAPTCHA timeout");

    await page.ClickAsync("#recaptcha-demo-submit");
    await page.WaitForLoadStateAsync(LoadState.NetworkIdle);
    Console.WriteLine($"Done. Final URL: {page.Url}");
}
finally
{
    // Always close to release the session even on error.
    await browser.CloseAsync();
}
