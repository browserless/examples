// Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeIndeedJobs {
  goto(url: ""https://www.indeed.com/jobs?q=data+scientist&l=Remote"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "".job_seen_beacon"", timeout: 15000) {
    time
  }
  jobs: mapSelector(selector: "".job_seen_beacon"") {
    title: mapSelector(selector: "".jobTitle a span"") { innerText }
    company: mapSelector(selector: "".companyName"") { innerText }
    location: mapSelector(selector: "".companyLocation"") { innerText }
    salary: mapSelector(selector: "".salary-snippet-container"") { innerText }
    snippet: mapSelector(selector: "".job-snippet"") { innerText }
    link: mapSelector(selector: "".jobTitle a"") {
      href: attribute(name: ""href"") { value }
    }
  }
}",
    variables = new { },
    operationName = "ScrapeIndeedJobs",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
