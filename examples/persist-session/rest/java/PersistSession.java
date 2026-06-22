// Creates a long-lived Browserless session and demonstrates persisting state across connections.
//
// Run: javac PersistSession.java && java PersistSession

import java.net.URI;
import java.net.http.*;

public class PersistSession {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/session?token=" + token;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(
                "{\"ttl\": 300000, \"stealth\": true, \"headless\": false}"
            ))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println("Session created: " + body);

        // Parse connect and stop URLs from response
        int connectStart = body.indexOf("\"connect\":\"") + 11;
        int connectEnd = body.indexOf("\"", connectStart);
        String connectUrl = body.substring(connectStart, connectEnd);

        int stopStart = body.indexOf("\"stop\":\"") + 8;
        int stopEnd = body.indexOf("\"", stopStart);
        String stopUrl = body.substring(stopStart, stopEnd);

        System.out.println("Connect URL: " + connectUrl);

        // Stop the session when done
        HttpRequest deleteRequest = HttpRequest.newBuilder()
            .uri(URI.create(stopUrl + "&force=true"))
            .DELETE()
            .build();

        client.send(deleteRequest, HttpResponse.BodyHandlers.ofString());
        System.out.println("Session stopped.");
    }
}
