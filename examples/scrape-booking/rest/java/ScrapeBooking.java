// Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeBooking.java && java ScrapeBooking

import java.net.URI;
import java.net.http.*;

public class ScrapeBooking {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeBooking {"
            + " goto(url: \\\"https://www.booking.com/searchresults.html?ss=New+York&checkin=2025-09-01&checkout=2025-09-07&group_adults=2\\\", waitUntil: networkIdle) { status }"
            + " waitForTimeout(time: 3000) { time }"
            + " hotels: mapSelector(selector: \\\"[data-testid='property-card']\\\") {"
            + "   name: mapSelector(selector: \\\"[data-testid='title']\\\") { innerText }"
            + "   price: mapSelector(selector: \\\"[data-testid='price-and-discounted-price']\\\") { innerText }"
            + "   rating: mapSelector(selector: \\\"[data-testid='review-score']\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeBooking\"}";

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
