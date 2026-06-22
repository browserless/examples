// Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeBooking {
      goto(url: ""https://www.booking.com/searchresults.html?ss=New+York&checkin=2025-09-01&checkout=2025-09-07&group_adults=2"", waitUntil: networkIdle) { status }
      waitForTimeout(time: 3000) { time }
      hotels: mapSelector(selector: ""[data-testid='property-card']"") {
        name: mapSelector(selector: ""[data-testid='title']"") { innerText }
        price: mapSelector(selector: ""[data-testid='price-and-discounted-price']"") { innerText }
        rating: mapSelector(selector: ""[data-testid='review-score']"") { innerText }
      }
    }",
    variables = new { },
    operationName = "ScrapeBooking",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
