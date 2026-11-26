// Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeBooking.java && java ScrapeBooking

import java.net.URI;
import java.net.http.*;
import java.time.LocalDate;

public class ScrapeBooking {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token
            + "&proxy=residential&proxyCountry=us";

        // Booking.com only shows prices for future stays, so search 30 days from today.
        LocalDate checkin = LocalDate.now().plusDays(30);
        String url = "https://www.booking.com/searchresults.html?ss=New+York&checkin=" + checkin
            + "&checkout=" + checkin.plusDays(1) + "&group_adults=2";

        String query = "mutation ScrapeBooking($url: String!) {"
            + " goto(url: $url, waitUntil: domContentLoaded) { status }"
            + " waitForSelector(selector: \\\"[data-testid='property-card']\\\", timeout: 30000) { time }"
            + " hotels: mapSelector(selector: \\\"[data-testid='property-card']\\\") {"
            + "   name: mapSelector(selector: \\\"[data-testid='title']\\\") { innerText }"
            + "   price: mapSelector(selector: \\\"[data-testid='price-and-discounted-price']\\\") { innerText }"
            + "   rating: mapSelector(selector: \\\"[data-testid='review-score'] [aria-hidden='true']\\\") { innerText }"
            + "   location: mapSelector(selector: \\\"[data-testid='address-link']\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {\"url\": \"" + url + "\"}}";

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
