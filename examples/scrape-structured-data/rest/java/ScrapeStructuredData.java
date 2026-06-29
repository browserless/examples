// Extracts structured data from a page using the Browserless /scrape endpoint.
// java.net.http is included in JDK 11+ — no extra dependency needed.
//
// Run: javac ScrapeStructuredData.java && java ScrapeStructuredData

import java.net.URI;
import java.net.http.*;

public class ScrapeStructuredData {
    private static final String TOKEN = "YOUR_API_TOKEN_HERE";

    public static void main(String[] args) throws Exception {
        String endpoint = "https://production-sfo.browserless.io/scrape?token=" + TOKEN;
        String jsonData = """
            {
                "url": "https://scraping-sandbox.netlify.app/products",
                "elements": [
                    { "selector": "h1" },
                    { "selector": "p" }
                ]
            }""";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonData))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}
