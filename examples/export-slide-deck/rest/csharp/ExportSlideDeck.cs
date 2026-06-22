// Exports a Google Slides presentation as a PDF using Browserless.
//
// Run: dotnet run

using System.Net.Http;
using System.Text;
using System.Text.Json;

string token = "YOUR_API_TOKEN_HERE";
string presentationId = "YOUR_PRESENTATION_ID";

var payload = new
{
    url = $"https://docs.google.com/presentation/d/{presentationId}/export/pdf",
    options = new { printBackground = true, format = "A4", landscape = true },
};

using (HttpClient httpClient = new HttpClient())
{
    var content = new StringContent(
        JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync(
        $"https://production-sfo.browserless.io/pdf?token={token}", content);
    var bytes = await response.Content.ReadAsByteArrayAsync();
    await File.WriteAllBytesAsync("slide-deck.pdf", bytes);
    Console.WriteLine("Exported to slide-deck.pdf");
}
