// Searches Google and extracts result headings with a BQL mutation on the /stealth/bql endpoint.
// Uses System.Net.Http and System.Text.Json from the .NET standard library.
// Stealth mode helps, but Google can still answer with a block or CAPTCHA page.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string endpoint = "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE";

string mutation = "mutation GoogleSearch { goto(url: \"https://www.google.com/search?q=Browserless+headless+browser\") { status } results: mapSelector(selector: \"h3\", wait: true) { innerText } }";

var payload = new { query = mutation, variables = new { } };

using HttpClient httpClient = new HttpClient();
var jsonPayload = JsonSerializer.Serialize(payload);
var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
var response = await httpClient.PostAsync(endpoint, content);
string responseBody = await response.Content.ReadAsStringAsync();
Console.WriteLine(responseBody);
