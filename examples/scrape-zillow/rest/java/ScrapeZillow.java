// Scrapes Zillow property listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeZillow.java && java ScrapeZillow

import java.net.URI;
import java.net.http.*;

public class ScrapeZillow {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeZillow {"
            + " goto(url: \\\"https://www.zillow.com/new-york-ny/\\\", waitUntil: networkIdle) { status }"
            + " waitForTimeout(time: 3000) { time }"
            + " listings: mapSelector(selector: \\\"[data-test='property-card']\\\") {"
            + "   address: mapSelector(selector: \\\"[data-test='property-card-addr']\\\") { innerText }"
            + "   price: mapSelector(selector: \\\"[data-test='property-card-price']\\\") { innerText }"
            + "   details: mapSelector(selector: \\\".StyledPropertyCardHomeDetails\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeZillow\"}";

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
