// Extracts all <img> src URLs from the fully rendered DOM, then downloads each
// image to an images/ directory. Useful when images are lazy-loaded or injected
// by JavaScript after initial page load.
//
// Add to pom.xml:
//   <dependency>
//     <groupId>com.microsoft.playwright</groupId>
//     <artifactId>playwright</artifactId>
//     <version>1.44.0</version>
//   </dependency>
//
// Compile: mvn compile
// Run:     mvn exec:java

import com.microsoft.playwright.*;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import java.util.List;

public class DownloadImages {
    public static void main(String[] args) throws Exception {
        String TOKEN = "YOUR_API_TOKEN_HERE";
        String WS_ENDPOINT = "wss://production-sfo.browserless.io?token=" + TOKEN;

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(WS_ENDPOINT);
            try {
                // Use the default context — creating a new one doesn't inherit launch settings.
                BrowserContext context = browser.contexts().get(0);
                Page page = context.newPage();
                page.navigate("https://example.com");
                page.waitForLoadState(LoadState.NETWORKIDLE);

                @SuppressWarnings("unchecked")
                List<String> imageUrls = (List<String>) page.evaluate("""
                    Array.from(document.querySelectorAll('img'))
                      .map(img => img.src)
                      .filter(src => src.startsWith('http'))
                """);

                System.out.println("Found " + imageUrls.size() + " images");
                Files.createDirectories(Path.of("images"));

                HttpClient client = HttpClient.newHttpClient();
                for (int i = 0; i < imageUrls.size(); i++) {
                    String url = imageUrls.get(i);
                    HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).build();
                    HttpResponse<byte[]> res = client.send(req, HttpResponse.BodyHandlers.ofByteArray());

                    // Use URI.getPath() to strip query strings before extracting the extension.
                    String urlPath = URI.create(url).getPath();
                    int dot = urlPath.lastIndexOf('.');
                    String ext = dot >= 0 ? urlPath.substring(dot) : ".jpg";

                    Path dest = Path.of("images/image-" + i + ext);
                    Files.write(dest, res.body());
                    System.out.println("Saved " + dest);
                }
            } finally {
                // Always close to release the session even on error.
                browser.close();
            }
        }
    }
}
