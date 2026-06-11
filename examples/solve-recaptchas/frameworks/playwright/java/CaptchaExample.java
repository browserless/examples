// Connects to Browserless with solveCaptchas=true and waits for the
// Browserless.captchaAutoSolved CDP event before submitting the form.
//
// Reuse the existing page from the default context so Browserless CDP events
// (including captchaAutoSolved) are visible on this page object. Register the
// CDP listener before navigation so the event isn't missed if the CAPTCHA solves
// immediately after the page loads.
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
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class CaptchaExample {
    public static void main(String[] args) throws Exception {
        String wsEndpoint =
            "wss://production-sfo.browserless.io/stealth"
            + "?token=YOUR_API_TOKEN_HERE"
            + "&proxy=residential&proxyCountry=us"
            + "&solveCaptchas=true&timeout=300000";

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(wsEndpoint);
            try {
                // Reuse the existing page from the default context so Browserless CDP
                // events (including captchaAutoSolved) are visible on this page object.
                BrowserContext context = browser.contexts().get(0);
                Page page = context.pages().get(0);
                CDPSession cdp = page.context().newCDPSession(page);

                // Register before navigation so the event isn't missed if the CAPTCHA
                // solves immediately after the page loads.
                CompletableFuture<Void> captchaSolved = new CompletableFuture<>();
                cdp.on("Browserless.captchaAutoSolved", event -> captchaSolved.complete(null));

                page.navigate(
                    "https://www.google.com/recaptcha/api2/demo",
                    new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE)
                );

                // Await the CDP event rather than a fixed timeout — fires when Browserless
                // finishes solving the CAPTCHA, not after an arbitrary number of seconds.
                captchaSolved.get(30, TimeUnit.SECONDS);

                page.click("#recaptcha-demo-submit");
                page.waitForLoadState(LoadState.NETWORKIDLE);
                System.out.println("Done. Final URL: " + page.url());
            } finally {
                // Always close to release the session even on error.
                browser.close();
            }
        }
    }
}
