// Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
// using the Browserless /export endpoint.
// Uses java.net.http.HttpClient (Java 11+) — no extra packages needed.
//
// Compile: javac DownloadImages.java
// Run:     java DownloadImages

import java.net.URI;
import java.net.http.*;
import java.nio.file.*;

public class DownloadImages {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";

        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create("https://production-sfo.browserless.io/export?token=" + token))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"url\":\"https://scraping-sandbox.netlify.app/harvest-direct\",\"includeResources\":true}"))
            .build();

        HttpResponse<byte[]> res = HttpClient.newHttpClient()
            .send(req, HttpResponse.BodyHandlers.ofByteArray());

        Files.write(Path.of("page.zip"), res.body());
        System.out.println("Saved page.zip");
    }
}
