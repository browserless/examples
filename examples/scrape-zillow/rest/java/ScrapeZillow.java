// Scrapes real estate agent names and profile URLs from a Zillow agent directory using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeZillow.java && java ScrapeZillow

import java.net.URI;
import java.net.http.*;

public class ScrapeZillow {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token
            + "&proxy=residential&proxySticky=true&proxyCountry=us&humanlike=true&blockAds=true";

        String query = """
            mutation ScrapeZillow {
              goto(url: "https://www.zillow.com/professionals/real-estate-agent-reviews/new-york-ny/", waitUntil: networkIdle) { status }
              waitForTimeout(time: 3000) { time }
              agents: mapSelector(selector: "a[href*='/profile/']") {
                name: mapSelector(selector: "h2") { innerText }
                profileUrl: attribute(name: "href") { value }
              }
            }
            """;

        // Escape the mutation into a JSON string value so no JSON library is needed.
        String escapedQuery = query.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
        String payload = "{\"query\": \"" + escapedQuery + "\", \"variables\": {}, \"operationName\": \"ScrapeZillow\"}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}
