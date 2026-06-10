// Accesses a Cloudflare Access-protected page by injecting Service Token headers
// via setExtraHTTPHeaders on a new context. Headers are sent on every request
// within that context.
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
import java.nio.file.Paths;
import java.util.Map;

public class CloudflareAccess {
    public static void main(String[] args) {
        String TOKEN = "YOUR_API_TOKEN_HERE";
        String WS_ENDPOINT = "wss://production-sfo.browserless.io?token=" + TOKEN;

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(WS_ENDPOINT);
            try {
                BrowserContext context = browser.newContext(
                    new Browser.NewContextOptions().setExtraHTTPHeaders(Map.of(
                        "CF-Access-Client-Id", "YOUR_CF_CLIENT_ID.access",
                        "CF-Access-Client-Secret", "YOUR_CF_CLIENT_SECRET"
                    ))
                );
                Page page = context.newPage();
                page.navigate("https://internal.example.com/dashboard");
                page.waitForLoadState(LoadState.NETWORKIDLE);
                System.out.println("Title: " + page.title());
                page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("dashboard.png")));
            } finally {
                // Always close to release the session even on error.
                browser.close();
            }
        }
    }
}
