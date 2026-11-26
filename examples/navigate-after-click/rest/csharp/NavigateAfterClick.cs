// Clicks a link and waits for navigation to complete using the /function API.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/function?token={token}";

string code = @"export default async ({ page }) => {
  await page.goto('https://scraping-sandbox.netlify.app/products');

  // Register the navigation wait before clicking — if you click first,
  // the page load can complete before waitForNavigation() starts listening.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('a[href=""/contact-us""]'),
  ]);

  const heading = await page.$eval('h1', el => el.textContent.trim());
  return { url: page.url(), heading };
};";

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(code, Encoding.UTF8, "application/javascript");
    var response = await httpClient.PostAsync(endpoint, content);
    string result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
}
