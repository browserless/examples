// Extracts patient records from a sandbox healthcare portal using BQL.
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
  goto(url: ""https://scraping-sandbox.netlify.app/clarity-health"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "".patient-record"", timeout: 10000) {
    time
  }
  patients: mapSelector(selector: "".patient-record"") {
    name: mapSelector(selector: "".patient-name"") { innerText }
    dob: mapSelector(selector: "".patient-dob"") { innerText }
    provider: mapSelector(selector: "".patient-provider"") { innerText }
    nextAppt: mapSelector(selector: "".patient-appointment"") { innerText }
    status: mapSelector(selector: "".patient-status"") { innerText }
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
