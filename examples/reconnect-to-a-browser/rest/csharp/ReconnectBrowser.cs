// Disconnects from a Browserless browser session and reconnects to the same session.
// Uses BQL over HTTP — no browser library required.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string bqlUrl = $"https://production-sfo.browserless.io/stealth/bql?token={token}";

var startPayload = new
{
    query = @"mutation StartSession {
      goto(url: ""https://scraping-sandbox.netlify.app/aether"", waitUntil: domContentLoaded) { status }
      reconnect(timeout: 60000) { browserQLEndpoint }
    }",
    variables = new { },
    operationName = "StartSession",
};

using (HttpClient httpClient = new HttpClient())
{
    var json = JsonSerializer.Serialize(startPayload);
    var content = new StringContent(json, Encoding.UTF8, "application/json");
    var startResponse = await httpClient.PostAsync(bqlUrl, content);
    string startBody = await startResponse.Content.ReadAsStringAsync();

    var doc = JsonDocument.Parse(startBody);
    string reconnectUrl = doc.RootElement
        .GetProperty("data")
        .GetProperty("reconnect")
        .GetProperty("browserQLEndpoint")
        .GetString() + $"?token={token}";

    var continuePayload = new
    {
        query = "mutation ContinueSession { html { html } }",
        variables = new { },
        operationName = "ContinueSession",
    };

    var continueContent = new StringContent(
        JsonSerializer.Serialize(continuePayload), Encoding.UTF8, "application/json");
    var continueResponse = await httpClient.PostAsync(reconnectUrl, continueContent);
    string continueBody = await continueResponse.Content.ReadAsStringAsync();
    Console.WriteLine(continueBody);
}
