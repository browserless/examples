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

        String query = "mutation ScrapeWalmart {"
            + " goto(url: \\\"https://www.walmart.com/search?q=coffee+maker\\\", waitUntil: networkIdle) { status }"
            + " waitForTimeout(time: 2000) { time }"
            + " products: mapSelector(selector: \\\"[data-item-id]\\\") {"
            + "   title: mapSelector(selector: \\\"[data-automation-id='product-title']\\\") { innerText }"
            + "   price: mapSelector(selector: \\\"[itemprop='price']\\\") { innerText }"
            + "   rating: mapSelector(selector: \\\"[data-testid='product-ratings']\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeWalmart\"}";

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
