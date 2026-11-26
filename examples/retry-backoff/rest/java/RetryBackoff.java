// Retries a Browserless /screenshot request with exponential backoff on failure.
//
// Run: javac RetryBackoff.java && java RetryBackoff

import java.net.URI;
import java.net.http.*;

public class RetryBackoff {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/screenshot?token=" + token;

        String body = "{\"url\": \"https://scraping-sandbox.netlify.app/dashboard\"}";

        HttpClient client = HttpClient.newHttpClient();
        int retries = 3;
        long baseDelay = 500;

        HttpResponse<byte[]> response = null;
        for (int attempt = 0; attempt <= retries; attempt++) {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

            response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 429) {
                if (attempt == retries) throw new RuntimeException("Browserless over capacity after retries");
                Thread.sleep(baseDelay * (1L << attempt));
                continue;
            }
            break;
        }

        System.out.println("Status: " + response.statusCode());
        System.out.println("Body length: " + response.body().length + " bytes");
    }
}
