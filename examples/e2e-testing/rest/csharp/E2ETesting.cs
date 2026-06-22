// Runs an end-to-end test against a remote Browserless browser using BQL.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/bql?token={token}";

var payload = new
{
    query = @"mutation E2ETest {
      goto(url: ""https://automationexercise.com"", waitUntil: networkIdle) { status }
      title { title }
      verify: text(selector: ""h2"") { text }
    }",
    variables = new { },
    operationName = "E2ETest",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();

    var doc = JsonDocument.Parse(body);
    int status = doc.RootElement.GetProperty("data").GetProperty("goto").GetProperty("status").GetInt32();
    if (status != 200) throw new Exception($"Expected status 200, got {status}");

    string title = doc.RootElement.GetProperty("data").GetProperty("title").GetProperty("title").GetString() ?? "";
    if (!title.Contains("Automation")) throw new Exception($"Title check failed: {title}");

    Console.WriteLine("E2E test passed.");
    Console.WriteLine($"Page title: {title}");
}
