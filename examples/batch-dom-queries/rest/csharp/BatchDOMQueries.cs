// Runs multiple DOM queries in a single BQL request.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/bql?token={token}";

var payload = new
{
    query = @"mutation BatchDOMQueries {
      goto(url: ""https://example.com"", waitUntil: networkIdle) { status }
      title { title }
      heading: text(selector: ""h1"") { text }
      description: attribute(selector: ""meta[name='description']"", name: ""content"") { value }
      links: mapSelector(selector: ""a"") {
        text: innerText
        href: attribute(name: ""href"") { value }
      }
    }",
    variables = new { },
    operationName = "BatchDOMQueries",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
