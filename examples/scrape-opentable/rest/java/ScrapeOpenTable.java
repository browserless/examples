// Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeOpenTable.java && java ScrapeOpenTable

import java.net.URI;
import java.net.http.*;

public class ScrapeOpenTable {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeOpenTable { goto(url: \\"https://www.opentable.com/s?term=italian&covers=2\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\"[data-test=restaurant-card]\\", timeout: 15000) { time } restaurants: mapSelector(selector: \\"[data-test=restaurant-card]\\") { name: mapSelector(selector: \\"h2\\") { innerText } rating: mapSelector(selector: \\"[data-test=rating-score]\\") { innerText } cuisine: mapSelector(selector: \\"[data-test=cuisine]\\") { innerText } priceRange: mapSelector(selector: \\"[data-test=price-range]\\") { innerText } bookingsToday: mapSelector(selector: \\"[data-test=bookings-today]\\") { innerText } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeOpenTable\"}";

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
