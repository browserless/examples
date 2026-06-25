// Scrapes Yelp business listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeYelp.java && java ScrapeYelp

import java.net.URI;
import java.net.http.*;

public class ScrapeYelp {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeYelp { goto(url: \\"https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\"[data-testid=serp-ia-card]\\", timeout: 15000) { time } businesses: mapSelector(selector: \\"[data-testid=serp-ia-card]\\") { name: mapSelector(selector: \\"a[class*=businessName] span\\") { innerText } rating: mapSelector(selector: \\"[aria-label*=star]\\") { ratingLabel: attribute(name: \\"aria-label\\") { value } } reviewCount: mapSelector(selector: \\"span[class*=reviewCount]\\") { innerText } categories: mapSelector(selector: \\"a[class*=categoryLink]\\") { innerText } priceRange: mapSelector(selector: \\"span[class*=priceRange]\\") { innerText } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeYelp\"}";

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
