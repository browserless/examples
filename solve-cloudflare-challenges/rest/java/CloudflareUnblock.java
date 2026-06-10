// Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
// proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
// harder to bypass from datacenter IPs.
//
// Uses java.net.http.HttpClient (Java 11+) and Gson for JSON parsing.
//
// Add to pom.xml:
//   <dependency>
//     <groupId>com.google.code.gson</groupId>
//     <artifactId>gson</artifactId>
//     <version>2.10.1</version>
//   </dependency>
//
// Compile: javac CloudflareUnblock.java
// Run:     java CloudflareUnblock

import com.google.gson.JsonParser;
import java.net.URI;
import java.net.http.*;

public class CloudflareUnblock {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        HttpClient client = HttpClient.newHttpClient();

        String body = "{\"url\":\"https://example-cloudflare-protected.com\","
            + "\"content\":true,\"cookies\":false,\"screenshot\":false,\"browserWSEndpoint\":false}";

        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create("https://production-sfo.browserless.io/unblock?token=" + token + "&proxy=residential"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
        String content = JsonParser.parseString(res.body()).getAsJsonObject()
            .get("content").getAsString();
        System.out.println(content.substring(0, Math.min(500, content.length())));
    }
}
