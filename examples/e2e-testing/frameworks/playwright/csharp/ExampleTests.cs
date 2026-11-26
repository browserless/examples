// Playwright E2E tests running against a remote Browserless browser.
// Install: dotnet add package Microsoft.Playwright.NUnit
// Run:     dotnet test

using Microsoft.Playwright;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ExampleTests
{
    private IPlaywright _playwright;
    private IBrowser _browser;
    private IBrowserContext _context;
    private IPage _page;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.ConnectAsync(
            "wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE"
        );
    }

    [SetUp]
    public async Task SetUp()
    {
        _context = await _browser.NewContextAsync();
        _page = await _context.NewPageAsync();
    }

    [TearDown]
    public async Task TearDown()
    {
        await _context.CloseAsync();
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        await _browser.CloseAsync();
        _playwright.Dispose();
    }

    [Test]
    public async Task PageHasCorrectTitle()
    {
        await _page.GotoAsync("https://scraping-sandbox.netlify.app/products");
        await Assertions.Expect(_page).ToHaveTitleAsync(new Regex("Product Catalog"));
    }

    [Test]
    public async Task HeadingIsVisible()
    {
        await _page.GotoAsync("https://scraping-sandbox.netlify.app/products");
        var heading = _page.Locator("h1");
        await Assertions.Expect(heading).ToBeVisibleAsync();
        await Assertions.Expect(heading).ToHaveTextAsync("Product Catalog");
    }

    [Test]
    public async Task PageHasLink()
    {
        await _page.GotoAsync("https://scraping-sandbox.netlify.app/products");
        await Assertions.Expect(_page.Locator("a[href]").First).ToBeVisibleAsync();
    }

    [Test]
    public async Task PageLoadsWithoutAnalytics()
    {
        var blocked = new List<string>();
        await _page.RouteAsync("**/analytics/**", async route =>
        {
            blocked.Add(route.Request.Url);
            await route.AbortAsync();
        });
        await _page.GotoAsync("https://scraping-sandbox.netlify.app/products");
        await Assertions.Expect(_page).ToHaveTitleAsync(new Regex("Product Catalog"));
        Console.WriteLine($"Blocked {blocked.Count} analytics request(s)");
    }
}
