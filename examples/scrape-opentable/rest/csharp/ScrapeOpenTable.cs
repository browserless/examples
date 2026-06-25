// Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    query = @"mutation ScrapeOpenTable {
  goto(url: ""https://www.opentable.com/s?term=italian&covers=2"", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ""[data-test=restaurant-card]"", timeout: 15000) {
    time
  }
  restaurants: mapSelector(selector: ""[data-test=restaurant-card]"") {
    name: mapSelector(selector: ""h2"") { innerText }
    rating: mapSelector(selector: ""[data-test=rating-score]"") { innerText }
    cuisine: mapSelector(selector: ""[data-test=cuisine]"") { innerText }
    priceRange: mapSelector(selector: ""[data-test=price-range]"") { innerText }
    bookingsToday: mapSelector(selector: ""[data-test=bookings-today]"") { innerText }
  }
}",
    variables = new { },
    operationName = "ScrapeOpenTable",
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
