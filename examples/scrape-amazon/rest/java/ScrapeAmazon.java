// Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
//
// Run: javac ScrapeAmazon.java && java ScrapeAmazon

import java.net.URI;
import java.net.http.*;

public class ScrapeAmazon {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/stealth/bql?token="
            + token + "&proxy=residential&proxyCountry=us";

        String query = "mutation ScrapeAmazon { goto(url: \\"https://www.amazon.com/s?k=wireless+headphones\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\"div.s-result-item[data-asin]\\", timeout: 15000) { time } products: mapSelector(selector: \\"div.s-result-item[data-asin]\\") { asin: attribute(name: \\"data-asin\\") { value } title: mapSelector(selector: \\"h2 span\\") { innerText } price: mapSelector(selector: \\".a-price .a-offscreen\\") { innerText } rating: mapSelector(selector: \\".a-icon-alt\\") { innerText } reviewCount: mapSelector(selector: \\".a-size-base.s-underline-text\\") { innerText } link: mapSelector(selector: \\"h2 a\\") { href: attribute(name: \\"href\\") { value } } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"ScrapeAmazon\"}";

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
