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
      goto(url: ""https://www.indeed.com/jobs?q=data+scientist&l=Remote"", waitUntil: domContentLoaded) { status }
      waitForSelector(selector: "".job_seen_beacon"", timeout: 15000) { time }
      jobs: mapSelector(selector: "".job_seen_beacon"") {
        title: mapSelector(selector: "".jobTitle a span"") { innerText }
        company: mapSelector(selector: ""[data-testid=company-name]"") { innerText }
        location: mapSelector(selector: ""[data-testid=text-location]"") { innerText }
        salary: mapSelector(selector: "".salary-snippet-container"") { innerText }
      }
    }",
    variables = new { },
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
