// Playwright E2E tests running against a remote Browserless browser.
// Requires: com.microsoft.playwright:playwright in pom.xml or build.gradle
// Run: mvn test  (or gradle test)

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class ExampleTest {
    static Playwright playwright;
    static Browser browser;
    BrowserContext context;
    Page page;

    @BeforeAll
    static void launchBrowser() {
        String token = "YOUR_API_TOKEN_HERE";
        playwright = Playwright.create();
        browser = playwright.chromium().connect(
            "wss://production-sfo.browserless.io/chromium/playwright?token=" + token
        );
    }

    @BeforeEach
    void createContextAndPage() {
        context = browser.newContext();
        page = context.newPage();
    }

    @AfterEach
    void closeContext() {
        context.close();
    }

    @AfterAll
    static void closeBrowser() {
        browser.close();
        playwright.close();
    }

    @Test
    void homepageLoads() {
        page.navigate("https://automationexercise.com");
        assertTrue(page.title().contains("Automation"), "Title should contain 'Automation'");
    }

    @Test
    void productsPageShowsItems() {
        page.navigate("https://automationexercise.com/products");
        page.waitForSelector(".features_items");
        int count = page.querySelectorAll(".product-image-wrapper").size();
        assertTrue(count > 0, "Should find at least one product");
    }
}
