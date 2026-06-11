// Two approaches for accessing Cloudflare Access-protected pages via the REST API:
//   1. Saved profile — reuse a browser session captured after logging in through CF Access.
//   2. Service Token — inject CF-Access headers via setExtraHTTPHeaders for machine-to-machine access.
//
// Uses java.net.http.HttpClient (Java 11+) — no extra dependencies needed.
// For production, use Jackson or Gson to serialize the nested setExtraHTTPHeaders object safely.
//
// Compile: javac CloudflareAccess.java
// Run:     java CloudflareAccess

import java.net.URI;
import java.net.http.*;
import java.nio.file.*;

public class CloudflareAccess {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        HttpClient client = HttpClient.newHttpClient();

        // Approach 1: reuse a saved authenticated profile.
        HttpRequest profileReq = HttpRequest.newBuilder()
            .uri(URI.create("https://production-sfo.browserless.io/screenshot"
                + "?token=" + token + "&profile=cf-access-profile"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(
                "{\"url\":\"https://internal.example.com/dashboard\"}"))
            .build();
        HttpResponse<byte[]> profileRes = client.send(profileReq, HttpResponse.BodyHandlers.ofByteArray());
        Files.write(Path.of("dashboard.png"), profileRes.body());
        System.out.println("Saved dashboard.png");

        // Approach 2: inject Service Token headers via setExtraHTTPHeaders.
        // Use Jackson or Gson for production — inline JSON is fragile for values with special characters.
        String tokenBody = "{\"url\":\"https://internal.example.com/dashboard\","
            + "\"setExtraHTTPHeaders\":{"
            + "\"CF-Access-Client-Id\":\"YOUR_CF_CLIENT_ID.access\","
            + "\"CF-Access-Client-Secret\":\"YOUR_CF_CLIENT_SECRET\"}}";
        HttpRequest tokenReq = HttpRequest.newBuilder()
            .uri(URI.create("https://production-sfo.browserless.io/content?token=" + token))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(tokenBody))
            .build();
        HttpResponse<String> tokenRes = client.send(tokenReq, HttpResponse.BodyHandlers.ofString());
        System.out.println(tokenRes.body().substring(0, Math.min(200, tokenRes.body().length())));
    }
}
