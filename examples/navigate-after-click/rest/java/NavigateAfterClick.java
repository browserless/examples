// Clicks a link and waits for navigation to complete using BQL.
//
// Run: javac NavigateAfterClick.java && java NavigateAfterClick

import java.net.URI;
import java.net.http.*;

public class NavigateAfterClick {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/bql?token=" + token;

        String query = "mutation NavigateAfterClick {"
            + " goto(url: \\\"https://scraping-sandbox.netlify.app/products\\\", waitUntil: networkIdle) { status }"
            + " click(selector: \\\"a\\\", waitForNavigation: true) { time }"
            + " title { title }"
            + " currentURL { url }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"NavigateAfterClick\"}";

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
