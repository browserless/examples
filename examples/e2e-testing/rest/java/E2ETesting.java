// Runs an end-to-end test against a remote Browserless browser using BQL.
//
// Run: javac E2ETesting.java && java E2ETesting

import java.net.URI;
import java.net.http.*;

public class E2ETesting {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/bql?token=" + token;

        String query = "mutation E2ETest {"
            + " goto(url: \\\"https://automationexercise.com\\\", waitUntil: networkIdle) { status }"
            + " title { title }"
            + " verify: text(selector: \\\"h2\\\") { text }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"E2ETest\"}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);

        if (!body.contains("\"status\":200")) {
            throw new AssertionError("Expected status 200");
        }
        System.out.println("E2E test passed.");
    }
}
