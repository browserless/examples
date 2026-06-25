// Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeTicketmaster {
  goto(url: ""https://www.ticketmaster.com/search?q=concerts"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ""[data-testid=search-event-card]"", timeout: 15000) {
    time
  }
  events: mapSelector(selector: ""[data-testid=search-event-card]"") {
    name: mapSelector(selector: ""[data-testid=event-name]"") { innerText }
    date: mapSelector(selector: ""[data-testid=event-date]"") { innerText }
    venue: mapSelector(selector: ""[data-testid=event-venue]"") { innerText }
    price: mapSelector(selector: ""[data-testid=event-price]"") { innerText }
    link: mapSelector(selector: ""a"") {
      href: attribute(name: ""href"") { value }
    }
  }
}",
    variables = new { },
    operationName = "ScrapeTicketmaster",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
