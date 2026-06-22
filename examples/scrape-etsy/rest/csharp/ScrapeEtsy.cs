// Scrapes Etsy product titles and prices from search results.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/scrape?token={token}";

var payload = new
{
    url = "https://www.etsy.com/search?q=candles",
    elements = new[]
    {
        new { selector = ".v2-listing-card h3" },
        new { selector = ".v2-listing-card .currency-value" },
    },
};

using (HttpClient httpClient = new HttpClient())
{
    var jsonPayload = JsonSerializer.Serialize(payload);
    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}
