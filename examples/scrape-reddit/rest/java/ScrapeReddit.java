// Scrapes Reddit posts from a subreddit using BQL with stealth mode.
//
// Run: javac ScrapeReddit.java && java ScrapeReddit

import java.net.URI;
import java.net.http.*;

public class ScrapeReddit {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token
            + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeRedditPosts {"
            + " goto(url: \\\"https://www.reddit.com/r/programming/\\\", waitUntil: domContentLoaded) { status }"
            + " waitForSelector(selector: \\\"shreddit-post\\\", timeout: 15000) { time }"
            + " posts: mapSelector(selector: \\\"shreddit-post\\\") {"
            + "   title: attribute(name: \\\"post-title\\\") { value }"
            + "   score: attribute(name: \\\"score\\\") { value }"
            + "   commentCount: attribute(name: \\\"comment-count\\\") { value }"
            + "   permalink: attribute(name: \\\"permalink\\\") { value }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}}";

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
