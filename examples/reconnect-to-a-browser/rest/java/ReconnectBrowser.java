// Disconnects from a Browserless browser session and reconnects to the same session.
// Uses BQL over HTTP — no browser library required.
//
// Run: javac ReconnectBrowser.java && java ReconnectBrowser

import java.net.URI;
import java.net.http.*;

public class ReconnectBrowser {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String bqlUrl = "https://production-sfo.browserless.io/stealth/bql?token=" + token;

        String startPayload = """
            {
              "query": "mutation StartSession { goto(url: \\"https://example.com\\", waitUntil: domContentLoaded) { status } reconnect(timeout: 60000) { browserQLEndpoint } }",
              "variables": {},
              "operationName": "StartSession"
            }
            """;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest startRequest = HttpRequest.newBuilder()
            .uri(URI.create(bqlUrl))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(startPayload))
            .build();

        HttpResponse<String> startResponse = client.send(startRequest, HttpResponse.BodyHandlers.ofString());
        String body = startResponse.body();

        // Extract browserQLEndpoint from the JSON response
        String marker = "\"browserQLEndpoint\":\"";
        int start = body.indexOf(marker) + marker.length();
        int end = body.indexOf("\"", start);
        String reconnectUrl = body.substring(start, end) + "?token=" + token;

        // Send follow-up mutation to the reconnected session
        String continuePayload = """
            {
              "query": "mutation ContinueSession { html { html } }",
              "variables": {},
              "operationName": "ContinueSession"
            }
            """;

        HttpRequest continueRequest = HttpRequest.newBuilder()
            .uri(URI.create(reconnectUrl))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(continuePayload))
            .build();

        HttpResponse<String> continueResponse = client.send(continueRequest, HttpResponse.BodyHandlers.ofString());
        System.out.println(continueResponse.body());
    }
}
