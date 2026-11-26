// Searches Google and extracts result headings with a BQL mutation on the /stealth/bql endpoint.
// Uses java.net.http from JDK 11+ — no extra dependencies.
// Stealth mode helps, but Google can still answer with a block or CAPTCHA page.
//
// Run: javac AutomateGoogleSearch.java && java AutomateGoogleSearch

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class GoogleSearch {
    public static void main(String[] args) throws Exception {
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE";

        String mutation = "mutation GoogleSearch { goto(url: \\\"https://www.google.com/search?q=Browserless+headless+browser\\\") { status } results: mapSelector(selector: \\\"h3\\\", wait: true) { innerText } }";
        String payload = "{\"query\": \"" + mutation + "\", \"variables\": {}}";

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
