// Runs multiple DOM queries in a single /function request.
//
// Run: javac BatchDOMQueries.java && java BatchDOMQueries

import java.net.URI;
import java.net.http.*;

public class BatchDOMQueries {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/function?token=" + token;

        String code = """
            export default async ({ page }) => {
              await page.goto('https://scraping-sandbox.netlify.app/products');

              const data = await page.evaluate(() => ({
                title: document.title,
                heading: document.querySelector('h1')?.textContent?.trim() ?? null,
                links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
                  text: a.textContent.trim(),
                  href: a.href,
                })),
                productCount: document.querySelectorAll('.product-title').length,
              }));

              return data;
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
