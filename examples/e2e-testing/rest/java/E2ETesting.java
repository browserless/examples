// Runs an end-to-end test against a remote Browserless browser using the /function API.
//
// Run: javac E2ETesting.java && java E2ETesting

import java.net.URI;
import java.net.http.*;

public class E2ETesting {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/function?token=" + token;

        String code = """
            export default async ({ page }) => {
              await page.goto('https://scraping-sandbox.netlify.app/products');
              const title = await page.title();
              const heading = await page.$eval('h1', el => el.textContent.trim());
              const hasLink = (await page.$('a[href]')) !== null;
              const results = [
                { test: 'title includes Product Catalog', passed: title.includes('Product Catalog') },
                { test: 'h1 reads Product Catalog', passed: heading === 'Product Catalog' },
                { test: 'page has at least one link', passed: hasLink },
              ];
              return { passed: results.every(r => r.passed), results };
            };
            """;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/javascript")
            .POST(HttpRequest.BodyPublishers.ofString(code))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}
