// Runs multiple DOM queries in a single /function request.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/function?token={token}";

string code = @"export default async ({ page }) => {
  await page.goto('https://scraping-sandbox.netlify.app/products');

  const data = await page.evaluate(() => ({
    title: document.title,
    heading: document.querySelector('h1')?.textContent?.trim() ?? null,
    links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
      text: a.textContent.trim(),
      href: a.href,
    })),
    productCount: document.querySelectorAll('.product-title').length,
  }));

  return data;
};";

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(code, Encoding.UTF8, "application/javascript");
    var response = await httpClient.PostAsync(endpoint, content);
    string result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
}
