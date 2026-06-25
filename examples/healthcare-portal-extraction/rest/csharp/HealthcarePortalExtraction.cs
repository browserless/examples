// Extracts patient medication records from a sandbox healthcare portal using BQL.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/chromium/bql?token={token}";

var payload = new
{
    query = @"mutation HealthcarePortal {
  goto(url: ""https://scraping-sandbox.netlify.app/clarity-health/patient-portal"", waitUntil: networkIdle) {
    status
  }
  waitForLogin: waitForSelector(selector: ""#patient-email"", timeout: 10000) {
    time
  }
  typeEmail: type(selector: ""#patient-email"", text: ""patient@example.com"") {
    time
  }
  typePassword: type(selector: ""#patient-password"", text: ""health2025"") {
    time
  }
  submitLogin: click(selector: ""#patient-login-submit"") {
    time
  }
  waitForDashboard: waitForSelector(selector: ""#medicationlist"", timeout: 10000) {
    time
  }
  medications: mapSelector(selector: ""#medicationlist table tbody tr"") {
    medication: mapSelector(selector: ""td:nth-child(1)"") { innerText }
    dosage: mapSelector(selector: ""td:nth-child(2)"") { innerText }
    frequency: mapSelector(selector: ""td:nth-child(3)"") { innerText }
    prescriber: mapSelector(selector: ""td:nth-child(4)"") { innerText }
    refills: mapSelector(selector: ""td:nth-child(5)"") { innerText }
  }
}",
    variables = new { },
    operationName = "HealthcarePortal",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
