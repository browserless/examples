// Exports a page's HTML and linked assets (CSS, JS, images) to a local directory
// by intercepting network responses as the page loads.
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
import java.nio.file.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

public class DownloadImages {
    record Asset(String url, byte[] buf) {}

    public static void main(String[] args) throws Exception {
        String TOKEN = "YOUR_API_TOKEN_HERE";
        String WS_ENDPOINT = "wss://production-sfo.browserless.io?token=" + TOKEN;

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(WS_ENDPOINT);
            try {
                BrowserContext context = browser.contexts().get(0);
                Page page = context.newPage();
                List<Asset> assets = new ArrayList<>();

                page.onResponse(response -> {
                    String type = response.request().resourceType();
                    if (List.of("stylesheet", "script", "image", "font").contains(type)) {
                        try {
                            assets.add(new Asset(response.url(), response.body()));
                        } catch (Exception ignored) {}
                    }
                });

                page.navigate("https://example.com");
                page.waitForLoadState(LoadState.NETWORKIDLE);

                String html = page.content();

                Files.createDirectories(Path.of("page"));
                Files.writeString(Path.of("page/index.html"), html);
                System.out.println("Saved page/index.html");

                for (int i = 0; i < assets.size(); i++) {
                    String urlPath = new URI(assets.get(i).url()).getPath();
                    int dot = urlPath.lastIndexOf('.');
                    String ext = dot >= 0 ? urlPath.substring(dot) : "";
                    Path dest = Path.of("page/asset-" + i + ext);
                    Files.write(dest, assets.get(i).buf());
                    System.out.println("Saved " + dest);
                }
            } finally {
                browser.close();
            }
        }
    }
}
