// Scrapes Glassdoor job listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeGlassdoor {
      goto(url: ""https://www.glassdoor.com/Job/new-york-software-engineer-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm"", waitUntil: networkIdle) { status }
      jobs: mapSelector(selector: ""[data-test='jobListing']"") {
        title: mapSelector(selector: ""a[data-test='job-title']"") { innerText }
        company: mapSelector(selector: ""[data-test='employer-name']"") { innerText }
        location: mapSelector(selector: ""[data-test='emp-location']"") { innerText }
        salary: mapSelector(selector: ""[data-test='detailSalary']"") { innerText }
      }
    }",
    variables = new { },
    operationName = "ScrapeGlassdoor",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
