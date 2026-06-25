// Fills and submits a job application form on a sandbox site using BQL.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/chromium/bql?token={token}";

var payload = new
{
    query = @"mutation FillJobApplication {
  goto(url: ""https://scraping-sandbox.netlify.app/helix/software-engineer-pipelines"", waitUntil: networkIdle) {
    status
  }
  clickApplicationTab: click(selector: ""button:nth-child(2)"") {
    time
  }
  waitForInputs: waitForSelector(selector: ""input[type=text]"", timeout: 10000) {
    time
  }
  typeName: type(selector: ""input[type=text]"", text: ""Jane Smith"") {
    time
  }
  typeEmail: type(selector: ""input[type=email]"", text: ""jane@example.com"") {
    time
  }
  typeMessage: type(selector: ""textarea"", text: ""Excited to contribute to the team!"") {
    time
  }
  submit: click(selector: ""div > button:only-of-type"") {
    time
  }
}",
    variables = new { },
    operationName = "FillJobApplication",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    Console.WriteLine(await response.Content.ReadAsStringAsync());
}
