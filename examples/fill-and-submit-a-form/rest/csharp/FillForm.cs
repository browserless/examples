// Fills and submits a form using BrowserQL — navigates, types, selects, solves a CAPTCHA,
// and clicks submit in a single request.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

const string Url = "https://production-sfo.browserless.io/chromium/bql";
const string Token = "YOUR_API_TOKEN_HERE";
string endpoint = $"{Url}?token={Token}";

var payload = new
{
    query = @"mutation FormExample {
  goto(url: ""https://www.browserless.io/practice-form"") {
    status
  }
  typeEmail: type(text: ""user@example.com"", selector: ""#Email"") {
    time
  }
  typeMessage: type(selector: ""#Message"", text: ""Hello from Browserless!"") {
    time
  }
  subject: select(selector: ""select#Subject"", value: ""Support"") {
    selector
  }
  solve {
    time
    solved
  }
  submitForm: click(selector: ""button[type='submit']"") {
    time
  }
}",
    variables = "",
    operationName = "FormExample",
};

using var client = new HttpClient();
var jsonPayload = JsonSerializer.Serialize(payload);
var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
var response = await client.PostAsync(endpoint, content);
Console.WriteLine(await response.Content.ReadAsStringAsync());
