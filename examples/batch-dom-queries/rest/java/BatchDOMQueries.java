// Runs multiple DOM queries in a single BQL request.
//
// Run: javac BatchDOMQueries.java && java BatchDOMQueries

import java.net.URI;
import java.net.http.*;

public class BatchDOMQueries {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/bql?token=" + token;

        String query = "mutation BatchDOMQueries {"
            + " goto(url: \\\"https://example.com\\\", waitUntil: networkIdle) { status }"
            + " title { title }"
            + " heading: text(selector: \\\"h1\\\") { text }"
            + " description: attribute(selector: \\\"meta[name='description']\\\", name: \\\"content\\\") { value }"
            + " links: mapSelector(selector: \\\"a\\\") { text: innerText href: attribute(name: \\\"href\\\") { value } }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"BatchDOMQueries\"}";

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
