// Creates a Browserless session and closes it via the Session API.
//
// Run: javac CloseSession.java && java CloseSession

import java.net.URI;
import java.net.http.*;

public class CloseSession {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/session?token=" + token;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(
                "{\"ttl\": 60000, \"stealth\": true}"
            ))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println("Session created: " + body);

        // Parse stop URL from response
        int stopStart = body.indexOf("\"stop\":\"") + 8;
        int stopEnd = body.indexOf("\"", stopStart);
        String stopUrl = body.substring(stopStart, stopEnd);

        HttpRequest deleteRequest = HttpRequest.newBuilder()
            .uri(URI.create(stopUrl + "&force=true"))
            .DELETE()
            .build();

        HttpResponse<String> deleteResponse = client.send(
            deleteRequest, HttpResponse.BodyHandlers.ofString()
        );
        System.out.println("Session closed: " + deleteResponse.statusCode());
    }
}
