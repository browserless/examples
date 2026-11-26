// Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeRealtor.java && java ScrapeRealtor

import java.net.URI;
import java.net.http.*;

public class ScrapeRealtor {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token
            + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeRealtor {"
            + " goto(url: \\\"https://www.realtor.com/realestateandhomes-search/San-Francisco_CA\\\", waitUntil: domContentLoaded) { status }"
            + " waitForSelector(selector: \\\"[data-testid=property-card]\\\", timeout: 15000) { time }"
            + " properties: mapSelector(selector: \\\"[data-testid=property-card]\\\") {"
            + "   price: mapSelector(selector: \\\".fs_700\\\") { innerText }"
            + "   address: mapSelector(selector: \\\"a .sr_true\\\") { innerText }"
            + "   beds: mapSelector(selector: \\\"[data-testid=property-meta-beds] [data-testid=meta-value]\\\") { innerText }"
            + "   baths: mapSelector(selector: \\\"[data-testid=property-meta-baths] [data-testid=meta-value]\\\") { innerText }"
            + "   sqft: mapSelector(selector: \\\"[data-testid=property-meta-sqft] [data-testid=meta-value]\\\") { innerText }"
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
