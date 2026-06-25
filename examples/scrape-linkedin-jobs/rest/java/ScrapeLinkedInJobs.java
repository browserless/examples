// Scrapes LinkedIn job listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeLinkedInJobs.java && java ScrapeLinkedInJobs

import java.net.URI;
import java.net.http.*;

public class ScrapeLinkedInJobs {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeLinkedInJobs { goto(url: \\"https://www.linkedin.com/jobs/search/?keywords=software+engineer&location=United+States\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\".base-card\\", timeout: 15000) { time } jobs: mapSelector(selector: \\".base-card\\") { title: mapSelector(selector: \\".base-search-card__title\\") { innerText } company: mapSelector(selector: \\".base-search-card__subtitle a\\") { innerText } location: mapSelector(selector: \\".job-search-card__location\\") { innerText } posted: mapSelector(selector: \\"time\\") { innerText } link: mapSelector(selector: \\"a.base-card__full-link\\") { href: attribute(name: \\"href\\") { value } } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeLinkedInJobs\"}";

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
