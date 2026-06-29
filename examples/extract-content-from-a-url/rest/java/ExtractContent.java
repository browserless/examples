// Fetches the fully rendered HTML of a page using the Browserless /content endpoint.
// java.net.http is included in JDK 11+ — no extra dependency needed.
//
// Run: javac ExtractContent.java && java ExtractContent

import java.net.URI;
import java.net.http.*;

public class ExtractContent {
    private static final String TOKEN = "YOUR_API_TOKEN_HERE";

    public static void main(String[] args) throws Exception {
        String endpoint = "https://production-sfo.browserless.io/content?token=" + TOKEN;
        String jsonData = "{\"url\": \"https://scraping-sandbox.netlify.app/javascript-enabled\"}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Cache-Control", "no-cache")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonData))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body().substring(0, Math.min(500, response.body().length())));
    }
}
