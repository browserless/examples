// Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeIndeedJobs.java && java ScrapeIndeedJobs

import java.net.URI;
import java.net.http.*;

public class ScrapeIndeedJobs {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeIndeedJobs { goto(url: \\"https://www.indeed.com/jobs?q=data+scientist&l=Remote\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\".job_seen_beacon\\", timeout: 15000) { time } jobs: mapSelector(selector: \\".job_seen_beacon\\") { title: mapSelector(selector: \\".jobTitle a span\\") { innerText } company: mapSelector(selector: \\".companyName\\") { innerText } location: mapSelector(selector: \\".companyLocation\\") { innerText } salary: mapSelector(selector: \\".salary-snippet-container\\") { innerText } snippet: mapSelector(selector: \\".job-snippet\\") { innerText } link: mapSelector(selector: \\".jobTitle a\\") { href: attribute(name: \\"href\\") { value } } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeIndeedJobs\"}";

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
