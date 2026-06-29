// Captures screenshots of multiple pages concurrently using the Browserless REST API.
// Uses java.net.http.HttpClient (Java 11+) with CompletableFuture — no extra dependencies.
//
// Compile: javac ConcurrentScreenshots.java
// Run:     java ConcurrentScreenshots
//
// Note: for production use, replace the string-concatenated JSON body with a library
// such as Jackson to handle URLs that contain quotes or backslashes safely.

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.IntStream;

public class ConcurrentScreenshots {
    public static void main(String[] args) {
        String token = "YOUR_API_TOKEN_HERE";
        List<String> urls = List.of(
            "https://scraping-sandbox.netlify.app/products",
            "https://scraping-sandbox.netlify.app/contact-us",
            "https://scraping-sandbox.netlify.app/receipt",
            "https://scraping-sandbox.netlify.app/dashboard",
            "https://scraping-sandbox.netlify.app/helix"
        );

        HttpClient client = HttpClient.newHttpClient();

        CompletableFuture<?>[] futures = IntStream.range(0, urls.size())
            .mapToObj(i -> {
                String body = "{\"url\":\"" + urls.get(i) + "\",\"options\":{\"type\":\"png\",\"fullPage\":true}}";
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://production-sfo.browserless.io/screenshot?token=" + token))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

                return client
                    .sendAsync(request, HttpResponse.BodyHandlers.ofByteArray())
                    .thenAccept(res -> {
                        try {
                            Files.write(Path.of("screenshot-" + (i + 1) + ".png"), res.body());
                            System.out.println("Saved screenshot-" + (i + 1) + ".png");
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    });
            })
            .toArray(CompletableFuture[]::new);

        CompletableFuture.allOf(futures).join();
        System.out.println("All done");
    }
}
