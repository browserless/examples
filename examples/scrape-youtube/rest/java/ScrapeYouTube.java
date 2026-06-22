// Scrapes YouTube search results using BQL with stealth mode.
//
// Run: javac ScrapeYouTube.java && java ScrapeYouTube

import java.net.URI;
import java.net.http.*;

public class ScrapeYouTube {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token;

        String query = "mutation ScrapeYouTube {"
            + " goto(url: \\\"https://www.youtube.com/results?search_query=javascript+tutorial\\\", waitUntil: networkIdle) { status }"
            + " waitForTimeout(time: 2000) { time }"
            + " videos: mapSelector(selector: \\\"ytd-video-renderer\\\") {"
            + "   title: mapSelector(selector: \\\"#video-title\\\") { innerText }"
            + "   channel: mapSelector(selector: \\\"[id='channel-name']\\\") { innerText }"
            + "   views: mapSelector(selector: \\\"span.inline-metadata-item\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeYouTube\"}";

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
