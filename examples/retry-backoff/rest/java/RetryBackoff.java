// Retries a Browserless BQL request with exponential backoff on failure.
//
// Run: javac RetryBackoff.java && java RetryBackoff

import java.net.URI;
import java.net.http.*;
import java.time.Duration;

public class RetryBackoff {
    static final int MAX_RETRIES = 5;
    static final long BASE_DELAY_MS = 1000;

    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/bql?token=" + token;
        String payload = "{\"query\": \"mutation { goto(url: \\\"https://scraping-sandbox.netlify.app/dashboard\\\", waitUntil: networkIdle) { status } title { title } }\", \"variables\": {}}";

        HttpClient client = HttpClient.newHttpClient();
        long delay = BASE_DELAY_MS;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    System.out.println("Success on attempt " + attempt + ":");
                    System.out.println(response.body());
                    return;
                }
                throw new RuntimeException("HTTP " + response.statusCode());
            } catch (Exception e) {
                if (attempt == MAX_RETRIES) throw e;
                System.out.println("Attempt " + attempt + " failed: " + e.getMessage() + ". Retrying in " + delay + "ms...");
                Thread.sleep(delay);
                delay *= 2;
            }
        }
    }
}
