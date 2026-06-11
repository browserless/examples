// Logs in once and reuses that authenticated state across future sessions.
// Phase 1 creates a named profile session (use Playwright to log in via CDP).
// Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
//
// Run: javac ReuseSession.java && java ReuseSession

import java.net.http.*;
import java.net.URI;
import java.nio.file.*;

public class ReuseSession {
    private static final String TOKEN = "YOUR_API_TOKEN_HERE";
    private static final String ORIGIN = "https://production-sfo.browserless.io";

    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        // Phase 1 – create a named profile session.
        HttpRequest sessionRequest = HttpRequest.newBuilder()
            .uri(URI.create(ORIGIN + "/profile?token=" + TOKEN))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"name\": \"my-profile\"}"))
            .build();
        String sessionBody = client.send(sessionRequest, HttpResponse.BodyHandlers.ofString()).body();
        System.out.println("Session: " + sessionBody);
        // Parse 'connect' from the response and use Playwright/Puppeteer to log in,
        // then call Browserless.saveProfile to persist the session.

        // Phase 2 – reuse the saved profile.
        HttpRequest screenshotRequest = HttpRequest.newBuilder()
            .uri(URI.create(ORIGIN + "/screenshot?token=" + TOKEN + "&profile=my-profile"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"url\": \"https://app.example.com/dashboard\"}"))
            .build();
        byte[] screenshot = client.send(screenshotRequest, HttpResponse.BodyHandlers.ofByteArray()).body();
        Files.write(Path.of("dashboard.png"), screenshot);
        System.out.println("Screenshot saved to dashboard.png.");
    }
}
