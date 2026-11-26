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
      goto(url: ""https://www.ticketmaster.com/search?q=concerts"", waitUntil: domContentLoaded) { status }
      waitForSelector(selector: ""[data-testid=eventList] > li"", timeout: 15000) { time }
      events: mapSelector(selector: ""[data-testid=eventList] > li"") {
        name: mapSelector(selector: ""button[aria-controls=eventOverflow] + span"") { innerText }
        date: mapSelector(selector: ""li > div > div > span:first-child"") { innerText }
        venue: mapSelector(selector: ""button[aria-controls=eventOverflow] + span + span span:last-child"") { innerText }
        link: mapSelector(selector: ""[data-testid=event-list-link]"") {
          href: attribute(name: ""href"") { value }
        }
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
