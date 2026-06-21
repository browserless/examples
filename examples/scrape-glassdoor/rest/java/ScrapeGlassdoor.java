// Scrapes Glassdoor job listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeGlassdoor.java && java ScrapeGlassdoor

import java.net.URI;
import java.net.http.*;

public class ScrapeGlassdoor {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeGlassdoor {"
            + " goto(url: \\\"https://www.glassdoor.com/Job/new-york-software-engineer-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm\\\", waitUntil: networkIdle) { status }"
            + " jobs: mapSelector(selector: \\\"[data-test='jobListing']\\\") {"
            + "   title: mapSelector(selector: \\\"a[data-test='job-title']\\\") { innerText }"
            + "   company: mapSelector(selector: \\\"[data-test='employer-name']\\\") { innerText }"
            + "   location: mapSelector(selector: \\\"[data-test='emp-location']\\\") { innerText }"
            + "   salary: mapSelector(selector: \\\"[data-test='detailSalary']\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeGlassdoor\"}";

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
