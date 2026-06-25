// Scrapes GitHub trending repositories using BQL.
//
// Run: javac ScrapeGitHubTrending.java && java ScrapeGitHubTrending

import java.net.URI;
import java.net.http.*;

public class ScrapeGitHubTrending {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/chromium/bql?token=" + token;

        String query = "mutation ScrapeGitHubTrending { goto(url: \\"https://github.com/trending\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\"article.Box-row\\", timeout: 15000) { time } repos: mapSelector(selector: \\"article.Box-row\\") { name: mapSelector(selector: \\"h2 a\\") { innerText } description: mapSelector(selector: \\"p\\") { innerText } language: mapSelector(selector: \\"[itemprop=programmingLanguage]\\") { innerText } stars: mapSelector(selector: \\"a[href*=stargazers]\\") { innerText } forks: mapSelector(selector: \\"a[href*=forks]\\") { innerText } todayStars: mapSelector(selector: \\"span.d-inline-block.float-sm-right\\") { innerText } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeGitHubTrending\"}";

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
