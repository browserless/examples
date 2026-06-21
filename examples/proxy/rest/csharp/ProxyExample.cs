// Routes browser traffic through a residential proxy and prints the resulting IP.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string endpoint = $"https://production-sfo.browserless.io/scrape?token={token}&proxy=residential&proxyCountry=us";

var payload = new
{
    url = "https://api.ipify.org?format=json",
    elements = new[] { new { selector = "body" } },
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(endpoint, content);
    string body = await response.Content.ReadAsStringAsync();
    Console.WriteLine(body);
}
