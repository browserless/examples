// Fills and submits a form using BrowserQL — navigates, types, picks options,
// and clicks submit in a single request.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string url = "https://production-sfo.browserless.io/chromium/bql";
string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"{url}?token={token}";

var payload = new
{
    query = @"mutation FormExample {
    goto(url: ""https://httpbin.org/forms/post"", waitUntil: domContentLoaded) {
      status
    }
    typeName: type(selector: ""input[name=custname]"", text: ""Jane Doe"") {
      time
    }
    typeEmail: type(selector: ""input[name=custemail]"", text: ""jane@example.com"") {
      time
    }
    chooseSize: click(selector: ""input[value=medium]"") {
      time
    }
    addTopping: checkbox(selector: ""input[value=cheese]"", checked: true) {
      time
    }
    typeComments: type(selector: ""textarea[name=comments]"", text: ""Hello from Browserless!"") {
      time
    }
    submitForm: click(selector: ""form button"") {
      time
    }
    response: text(selector: ""body"") {
      text
    }
  }",
    variables = new { },
    operationName = "FormExample",
};

using (HttpClient httpClient = new HttpClient())
{
    var jsonPayload = JsonSerializer.Serialize(payload);
    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}
