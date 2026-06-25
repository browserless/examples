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
  goto(url: ""https://scraping-sandbox.netlify.app/helix"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ""form"", timeout: 10000) {
    time
  }
  typeName: type(selector: ""input[name=name]"", text: ""Jane Smith"") {
    time
  }
  typeEmail: type(selector: ""input[name=email]"", text: ""jane@example.com"") {
    time
  }
  typePhone: type(selector: ""input[name=phone]"", text: ""555-123-4567"") {
    time
  }
  selectDept: select(selector: ""select[name=department]"", value: ""Engineering"") {
    selector
  }
  typeMessage: type(selector: ""textarea[name=message]"", text: ""Excited to contribute to the team!"") {
    time
  }
  submit: click(selector: ""button[type=submit]"") {
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
