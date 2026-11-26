// Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeWalmart.java && java ScrapeWalmart

import java.net.URI;
import java.net.http.*;

public class ScrapeWalmart {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = """
            mutation ScrapeWalmart {
              goto(url: "https://www.walmart.com/search?q=iphone", waitUntil: domContentLoaded) { status }
              waitForTimeout(time: 3000) { time }
              products: mapSelector(selector: "[data-item-id]") {
                name: mapSelector(selector: "[data-automation-id='product-title']") { innerText }
                price: mapSelector(selector: "[data-testid='unified-global-product-price-a11y-text']") { innerText }
                rating: mapSelector(selector: "[data-testid='product-ratings']") { innerText }
                reviewCount: mapSelector(selector: "[data-testid='product-reviews']") { innerText }
                link: mapSelector(selector: "a[href*='/ip/']") { href: attribute(name: "href") { value } }
              }
            }
            """;

        String payload = "{\"query\": " + com.google.gson.JsonParser.parseString(query) + ", \"variables\": {}, \"operationName\": \"ScrapeWalmart\"}";

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
