// Scrapes Reddit posts from a subreddit using BQL with stealth mode.
//
// Run: javac ScrapeReddit.java && java ScrapeReddit

import java.net.URI;
import java.net.http.*;

public class ScrapeReddit {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token;

        String query = "mutation ScrapeReddit {"
            + " goto(url: \\\"https://www.reddit.com/r/programming/\\\", waitUntil: networkIdle) { status }"
            + " waitForTimeout(time: 2000) { time }"
            + " posts: mapSelector(selector: \\\"article\\\") {"
            + "   title: mapSelector(selector: \\\"[id*='post-title']\\\") { innerText }"
            + "   score: mapSelector(selector: \\\"[id*='vote-arrows']\\\") { innerText }"
            + "   comments: mapSelector(selector: \\\"a[data-click-id='comments']\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeReddit\"}";

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
