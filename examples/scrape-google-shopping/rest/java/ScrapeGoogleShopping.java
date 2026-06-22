// Scrapes Google Shopping results using BQL with stealth mode.
//
// Run: javac ScrapeGoogleShopping.java && java ScrapeGoogleShopping

import java.net.URI;
import java.net.http.*;

public class ScrapeGoogleShopping {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token=" + token;

        String query = "mutation ScrapeGoogleShopping {"
            + " goto(url: \\\"https://www.google.com/search?q=wireless+headphones&tbm=shop\\\", waitUntil: networkIdle) { status }"
            + " products: mapSelector(selector: \\\".sh-dgr__grid-result\\\") {"
            + "   title: mapSelector(selector: \\\"h3.tAxDx\\\") { innerText }"
            + "   price: mapSelector(selector: \\\".a8Pemb\\\") { innerText }"
            + "   store: mapSelector(selector: \\\".aULzUe\\\") { innerText }"
            + "   rating: mapSelector(selector: \\\".Rsc7Yb\\\") { innerText }"
            + " }"
            + " }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeGoogleShopping\"}";

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
