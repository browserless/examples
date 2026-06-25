// Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeTicketmaster.java && java ScrapeTicketmaster

import java.net.URI;
import java.net.http.*;

public class ScrapeTicketmaster {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeTicketmaster { goto(url: \\"https://www.ticketmaster.com/search?q=concerts\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\"[data-testid=search-event-card]\\", timeout: 15000) { time } events: mapSelector(selector: \\"[data-testid=search-event-card]\\") { name: mapSelector(selector: \\"[data-testid=event-name]\\") { innerText } date: mapSelector(selector: \\"[data-testid=event-date]\\") { innerText } venue: mapSelector(selector: \\"[data-testid=event-venue]\\") { innerText } price: mapSelector(selector: \\"[data-testid=event-price]\\") { innerText } link: mapSelector(selector: \\"a\\") { href: attribute(name: \\"href\\") { value } } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeTicketmaster\"}";

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
