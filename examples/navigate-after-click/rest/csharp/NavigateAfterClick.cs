// Clicks a link and waits for navigation to complete using BQL.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/bql?token={token}";

var payload = new
{
    query = @"mutation NavigateAfterClick {
      goto(url: ""https://scraping-sandbox.netlify.app/products"", waitUntil: networkIdle) { status }
      click(selector: ""a"", waitForNavigation: true) { time }
      title { title }
      currentURL { url }
    }",
    variables = new { },
    operationName = "NavigateAfterClick",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
