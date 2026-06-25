// Scrapes LinkedIn job listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeLinkedInJobs {
  goto(url: ""https://www.linkedin.com/jobs/search/?keywords=software+engineer&location=United+States"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "".base-card"", timeout: 15000) {
    time
  }
  jobs: mapSelector(selector: "".base-card"") {
    title: mapSelector(selector: "".base-search-card__title"") { innerText }
    company: mapSelector(selector: "".base-search-card__subtitle a"") { innerText }
    location: mapSelector(selector: "".job-search-card__location"") { innerText }
    posted: mapSelector(selector: ""time"") { innerText }
    link: mapSelector(selector: ""a.base-card__full-link"") {
      href: attribute(name: ""href"") { value }
    }
  }
}",
    variables = new { },
    operationName = "ScrapeLinkedInJobs",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
