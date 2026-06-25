// Scrapes IMDb top movie ratings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeIMDb.java && java ScrapeIMDb

import java.net.URI;
import java.net.http.*;

public class ScrapeIMDb {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeIMDb { goto(url: \\"https://www.imdb.com/chart/top/\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\".ipc-metadata-list-summary-item\\", timeout: 15000) { time } movies: mapSelector(selector: \\".ipc-metadata-list-summary-item\\") { title: mapSelector(selector: \\".ipc-title__text\\") { innerText } metadata: mapSelector(selector: \\".cli-title-metadata span\\") { innerText } rating: mapSelector(selector: \\".ipc-rating-star--imdb\\") { ratingLabel: attribute(name: \\"aria-label\\") { value } } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeIMDb\"}";

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
