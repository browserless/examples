// Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeRealtor.java && java ScrapeRealtor

import java.net.URI;
import java.net.http.*;

public class ScrapeRealtor {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeRealtor { goto(url: \\"https://www.realtor.com/realestateandhomes-search/San-Francisco_CA\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\"[data-testid=card-content]\\", timeout: 15000) { time } properties: mapSelector(selector: \\"[data-testid=card-content]\\") { price: mapSelector(selector: \\"[data-testid=card-price]\\") { innerText } address: mapSelector(selector: \\"[data-testid=card-address]\\") { innerText } beds: mapSelector(selector: \\"[data-testid=property-meta-beds] span\\") { innerText } baths: mapSelector(selector: \\"[data-testid=property-meta-baths] span\\") { innerText } sqft: mapSelector(selector: \\"[data-testid=property-meta-sqft] span\\") { innerText } status: mapSelector(selector: \\"[data-testid=card-description]\\") { innerText } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeRealtor\"}";

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
