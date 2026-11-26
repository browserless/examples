// Scrapes title, channel, views, likes, and upload date from a YouTube video page using BQL with stealth mode.
//
// Run: javac ScrapeYouTube.java && java ScrapeYouTube

import java.net.URI;
import java.net.http.*;

public class ScrapeYouTube {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token;

        String query = "mutation ScrapeYouTubeVideo {"
            + " goto(url: \\\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\\\", waitUntil: domContentLoaded) { status }"
            + " waitForSelector(selector: \\\"#view-count[aria-label]\\\", timeout: 20000) { time }"
            + " title: text(selector: \\\"h1.ytd-watch-metadata yt-formatted-string\\\") { text }"
            + " channel: text(selector: \\\"ytd-channel-name yt-formatted-string a\\\") { text }"
            + " views: mapSelector(selector: \\\"#view-count\\\") { label: attribute(name: \\\"aria-label\\\") { value } }"
            + " likes: mapSelector(selector: \\\"#top-level-buttons-computed like-button-view-model button\\\") { label: attribute(name: \\\"aria-label\\\") { value } }"
            + " uploadDate: text(selector: \\\"#info-strings yt-formatted-string\\\") { text }"
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
