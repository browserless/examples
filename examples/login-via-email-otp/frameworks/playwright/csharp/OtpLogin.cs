// Automates an email OTP login flow using Playwright.
// Navigates to the login page, submits the email to trigger the OTP, waits for
// the OTP field to appear, then reads and enters the code.
//
// Substitute GetOtpFromInbox() with your actual inbox API (Mailosaur, Mailslurp,
// Gmail API, IMAP, etc.). Poll after the OTP field appears — not before — to
// avoid reading a stale code from an earlier session.
//
// Install: dotnet add package Microsoft.Playwright
// Run:     dotnet run

using Microsoft.Playwright;
using System;
using System.Threading.Tasks;

static string GetOtpFromInbox(string email)
{
    // Swap this stub with your actual inbox API.
    throw new NotImplementedException("Implement GetOtpFromInbox() with your email provider");
}

const string Token = "YOUR_API_TOKEN_HERE";
const string WsEndpoint = $"wss://production-sfo.browserless.io?token={Token}";

using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.ConnectOverCDPAsync(WsEndpoint);

try
{
    // Reuse the existing page from the default context so Browserless CDP
    // events are visible on this page object.
    var context = browser.Contexts[0];
    var page = context.Pages[0];

    // Submit the email to trigger the OTP — the form changes state before the OTP field appears.
    await page.GotoAsync("https://app.example.com/login");
    await page.FillAsync("input[type='email']", "user@example.com");
    await page.ClickAsync("button[type='submit']");
    await page.WaitForSelectorAsync("input[name='otp'], input[autocomplete='one-time-code']");

    // Poll the inbox after the OTP field appears, not before — the email may not be sent yet.
    var otp = GetOtpFromInbox("user@example.com");
    Console.WriteLine($"Got OTP: {otp}");

    await page.FillAsync("input[name='otp'], input[autocomplete='one-time-code']", otp);
    await page.ClickAsync("button[type='submit']");
    await page.WaitForLoadStateAsync(LoadState.NetworkIdle);
    Console.WriteLine($"Logged in. URL: {page.Url}");
}
finally
{
    // Always close to release the session even on error.
    await browser.CloseAsync();
}
