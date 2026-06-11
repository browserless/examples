// Captures a webpage as a PNG using the Browserless /screenshot endpoint.
// java.net.http is included in JDK 11+ — no extra dependency needed.
//
// Run: javac TakeScreenshot.java && java TakeScreenshot

import java.io.*;
import java.net.URI;
import java.net.http.*;

public class TakeScreenshot {
    private static final String TOKEN = "YOUR_API_TOKEN_HERE";

    public static void main(String[] args) throws Exception {
        String endpoint = "https://production-sfo.browserless.io/screenshot?token=" + TOKEN;
        String jsonData = """
            {
                "url": "https://example.com",
                "options": { "fullPage": true, "type": "png" }
            }""";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Cache-Control", "no-cache")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonData))
            .build();

        HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
        try (FileOutputStream fos = new FileOutputStream("screenshot.png")) {
            response.body().transferTo(fos);
        }
        System.out.println("Screenshot saved as screenshot.png.");
    }
}
