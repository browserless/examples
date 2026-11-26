// Clicks a link and waits for navigation to complete using the /function API.
//
// Run: javac NavigateAfterClick.java && java NavigateAfterClick

import java.net.URI;
import java.net.http.*;

public class NavigateAfterClick {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/function?token=" + token;

        String code = """
            export default async ({ page }) => {
              await page.goto('https://scraping-sandbox.netlify.app/products');

              // Register the navigation wait before clicking — if you click first,
              // the page load can complete before waitForNavigation() starts listening.
              await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('a[href="/contact-us"]'),
              ]);

              const heading = await page.$eval('h1', el => el.textContent.trim());
              return { url: page.url(), heading };
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
