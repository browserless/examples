// Playwright E2E tests running against a remote Browserless browser.
// Install: dotnet add package Microsoft.Playwright.NUnit
// Run:     dotnet test

using Microsoft.Playwright;
using NUnit.Framework;

[TestFixture]
public class ExampleTests
{
    private IPlaywright _playwright;
    private IBrowser _browser;
    private IBrowserContext _context;
    private IPage _page;

    [OneTimeSetUp]
    public async Task Setup()
    {
        string token = "YOUR_API_TOKEN_HERE";
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.ConnectAsync(
            $"wss://production-sfo.browserless.io/chromium/playwright?token={token}"
        );
    }

    [SetUp]
    public async Task CreatePage()
    {
        _context = await _browser.NewContextAsync();
        _page = await _context.NewPageAsync();
    }

    [TearDown]
    public async Task ClosePage() => await _context.CloseAsync();

    [OneTimeTearDown]
    public async Task Teardown()
    {
        await _browser.CloseAsync();
        _playwright.Dispose();
    }

    [Test]
    public async Task HomepageLoads()
    {
        await _page.GotoAsync("https://automationexercise.com");
        StringAssert.Contains("Automation", await _page.TitleAsync());
    }

    [Test]
    public async Task ProductsPageShowsItems()
    {
        await _page.GotoAsync("https://automationexercise.com/products");
        await _page.WaitForSelectorAsync(".features_items");
        var products = await _page.QuerySelectorAllAsync(".product-image-wrapper");
        Assert.That(products.Count, Is.GreaterThan(0));
    }
}
