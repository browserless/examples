// Logs in once and reuses that authenticated state across future sessions.
// connectOverCDP is required for Browserless.saveProfile — connect() does not expose CDP sessions.
//
// Requires: playwright 1.44+, Gson for JSON parsing
// Run: mvn compile exec:java -Dexec.mainClass="SaveSession"

import com.microsoft.playwright.*;
import com.google.gson.*;
import java.net.http.*;
import java.net.URI;
import java.util.Map;

public class SaveSession {
    private static final String TOKEN = "YOUR_API_TOKEN_HERE";
    private static final String ORIGIN = "https://production-sfo.browserless.io";

    public static void main(String[] args) throws Exception {
        HttpClient http = HttpClient.newHttpClient();

        // Phase 1 – create a named profile session and log in.
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(ORIGIN + "/profile?token=" + TOKEN))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"name\": \"my-profile\"}"))
            .build();
        String body = http.send(req, HttpResponse.BodyHandlers.ofString()).body();
        String wsEndpoint = JsonParser.parseString(body)
            .getAsJsonObject().get("connect").getAsString();

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(wsEndpoint);
            try {
                BrowserContext context = browser.contexts().get(0);
                Page page = context.newPage();
                page.navigate("https://app.example.com/login");
                page.fill("#email", "user@example.com");
                page.fill("#password", System.getenv("PASSWORD"));
                page.click("button[type='submit']");
                page.waitForURL("**/dashboard");

                // CDP command must be sent after navigation completes so all cookies are written.
                CDPSession cdp = page.context().newCDPSession(page);
                JsonElement result = cdp.send("Browserless.saveProfile",
                    new Gson().toJsonTree(Map.of("name", "my-profile")));
                System.out.println(result);
                // {"ok":true,"profileId":"<id>","name":"my-profile","cookieCount":12,"originCount":1}
            } finally {
                // Always close to release the session even on error.
                browser.close();
            }

            // Phase 2 – reuse the saved profile.
            String wsReuse = "wss://production-sfo.browserless.io?token=" + TOKEN + "&profile=my-profile";
            Browser browser2 = playwright.chromium().connectOverCDP(wsReuse);
            try {
                BrowserContext context = browser2.contexts().get(0);
                Page page = context.pages().get(0);
                page.navigate("https://app.example.com/dashboard"); // already logged in
                System.out.println("Title: " + page.title());
            } finally {
                // Always close to release the session even on error.
                browser2.close();
            }
        }
    }
}
