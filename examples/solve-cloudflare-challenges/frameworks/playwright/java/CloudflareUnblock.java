// Bypasses Cloudflare challenges via /unblock, then connects Playwright to the
// already-unblocked session using the returned browserWSEndpoint.
// The ttl parameter keeps the browser alive long enough for the client to connect.
//
// Add to pom.xml:
//   <dependency>
//     <groupId>com.microsoft.playwright</groupId>
//     <artifactId>playwright</artifactId>
//     <version>1.44.0</version>
//   </dependency>
//   <dependency>
//     <groupId>com.google.code.gson</groupId>
//     <artifactId>gson</artifactId>
//     <version>2.10.1</version>
//   </dependency>
//
// Compile: mvn compile
// Run:     mvn exec:java

import com.google.gson.JsonParser;
import com.microsoft.playwright.*;
import java.net.URI;
import java.net.http.*;

public class CloudflareUnblock {
    public static void main(String[] args) throws Exception {
        String TOKEN = "YOUR_API_TOKEN_HERE";
        HttpClient client = HttpClient.newHttpClient();

        String body = "{\"url\":\"https://example-cloudflare-protected.com\","
            + "\"browserWSEndpoint\":true,\"ttl\":30000}";
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create("https://production-sfo.browserless.io/unblock?token=" + TOKEN + "&proxy=residential"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();
        HttpResponse<String> httpRes = client.send(req, HttpResponse.BodyHandlers.ofString());

        // The /unblock response returns a raw WebSocket URL — append the token before connecting.
        String wsEndpoint = JsonParser.parseString(httpRes.body()).getAsJsonObject()
            .get("browserWSEndpoint").getAsString() + "?token=" + TOKEN;

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(wsEndpoint);
            try {
                BrowserContext context = browser.contexts().get(0);
                Page page = context.pages().get(0);
                System.out.println("Title: " + page.title());
                System.out.println("URL: " + page.url());
            } finally {
                // Always close to release the session even on error.
                browser.close();
            }
        }
    }
}
