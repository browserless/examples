// Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeTicketmaster.java && java ScrapeTicketmaster

import java.net.URI;
import java.net.http.*;

public class ScrapeTicketmaster {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token
            + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeTicketmaster {"
            + " goto(url: \\\"https://www.ticketmaster.com/search?q=concerts\\\", waitUntil: domContentLoaded) { status }"
            + " waitForSelector(selector: \\\"[data-testid=eventList] > li\\\", timeout: 15000) { time }"
            + " events: mapSelector(selector: \\\"[data-testid=eventList] > li\\\") {"
            + "   name: mapSelector(selector: \\\"button[aria-controls=eventOverflow] + span\\\") { innerText }"
            + "   date: mapSelector(selector: \\\"li > div > div > span:first-child\\\") { innerText }"
            + "   venue: mapSelector(selector: \\\"button[aria-controls=eventOverflow] + span + span span:last-child\\\") { innerText }"
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
