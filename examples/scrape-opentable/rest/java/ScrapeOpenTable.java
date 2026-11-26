// Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeOpenTable.java && java ScrapeOpenTable

import java.net.URI;
import java.net.http.*;

public class ScrapeOpenTable {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token
            + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeOpenTable {"
            + " goto(url: \\\"https://www.opentable.com/s?term=italian&covers=2\\\", waitUntil: domContentLoaded) { status }"
            + " waitForSelector(selector: \\\"[data-test=restaurant-card]:has(h6)\\\", timeout: 15000) { time }"
            + " restaurants: mapSelector(selector: \\\"[data-test=restaurant-card]:has(h6)\\\") {"
            + "   name: mapSelector(selector: \\\"h6\\\") { innerText }"
            + "   summary: mapSelector(selector: \\\"[data-testid=search-list-card-content-container] > div:nth-child(2)\\\") { innerText }"
            + "   cuisine: mapSelector(selector: \\\"[aria-label^=Price] + span\\\") { innerText }"
            + "   priceRange: mapSelector(selector: \\\"[aria-label^=Price]\\\") { innerText }"
            + "   bookingsToday: mapSelector(selector: \\\"[data-testid=icSocialProof] + span\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}}";

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
