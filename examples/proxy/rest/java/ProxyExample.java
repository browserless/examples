// Routes browser traffic through a residential proxy and prints the resulting IP.
//
// Run: javac ProxyExample.java && java ProxyExample

import java.net.URI;
import java.net.http.*;

public class ProxyExample {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/scrape?token=" + token
            + "&proxy=residential&proxyCountry=us";

        String payload = "{\"url\": \"https://api.ipify.org?format=json\", \"elements\": [{\"selector\": \"body\"}]}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}
