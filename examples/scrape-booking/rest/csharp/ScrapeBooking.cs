// Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
//
// Run: dotnet run

using System.Globalization;
using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/stealth/bql?token={token}&proxy=residential&proxyCountry=us";

// Booking.com only shows prices for future stays, so search 30 days from today.
DateTime checkin = DateTime.Today.AddDays(30);
string checkinDate = checkin.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
string checkoutDate = checkin.AddDays(1).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
string url = "https://www.booking.com/searchresults.html?ss=New+York"
    + $"&checkin={checkinDate}&checkout={checkoutDate}&group_adults=2";

var payload = new
{
    query = @"mutation ScrapeBooking($url: String!) {
      goto(url: $url, waitUntil: domContentLoaded) { status }
      waitForSelector(selector: ""[data-testid='property-card']"", timeout: 30000) { time }
      hotels: mapSelector(selector: ""[data-testid='property-card']"") {
        name: mapSelector(selector: ""[data-testid='title']"") { innerText }
        price: mapSelector(selector: ""[data-testid='price-and-discounted-price']"") { innerText }
        rating: mapSelector(selector: ""[data-testid='review-score'] [aria-hidden='true']"") { innerText }
        location: mapSelector(selector: ""[data-testid='address-link']"") { innerText }
      }
    }",
    variables = new { url },
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
