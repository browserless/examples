// Scrapes Etsy product titles and prices from search results.
//
// Run: javac ScrapeEtsy.java && java ScrapeEtsy

import java.net.URI;
import java.net.http.*;

public class ScrapeEtsy {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/scrape?token=" + token;

        String payload = """
            {
              "url": "https://www.etsy.com/search?q=candles",
              "elements": [
                { "selector": ".v2-listing-card h3" },
                { "selector": ".v2-listing-card .currency-value" }
              ]
            }
            """;

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
