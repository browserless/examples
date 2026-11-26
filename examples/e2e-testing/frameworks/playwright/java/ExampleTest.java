// Playwright E2E tests running against a remote Browserless browser.
// Requires: com.microsoft.playwright:playwright in pom.xml or build.gradle
// Run: mvn test  (or gradle test)

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.util.*;
import java.util.regex.Pattern;

class ExampleTest {
    static Playwright playwright;
    static Browser browser;
    BrowserContext context;
    Page page;

    @BeforeAll
    static void connect() {
        playwright = Playwright.create();
        browser = playwright.chromium().connect(
            "wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE"
        );
    }

    @AfterAll
    static void disconnect() {
        playwright.close();
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

    @Test
    void pageHasCorrectTitle() {
        page.navigate("https://scraping-sandbox.netlify.app/products");
        assertThat(page).hasTitle(Pattern.compile("Product Catalog"));
    }

    @Test
    void headingIsVisible() {
        page.navigate("https://scraping-sandbox.netlify.app/products");
        Locator heading = page.locator("h1");
        assertThat(heading).isVisible();
        assertThat(heading).hasText("Product Catalog");
    }

    @Test
    void pageHasLink() {
        page.navigate("https://scraping-sandbox.netlify.app/products");
        assertThat(page.locator("a[href]").first()).isVisible();
    }

    @Test
    void pageLoadsWithoutAnalytics() {
        List<String> blocked = new ArrayList<>();
        page.route("**/analytics/**", route -> {
            blocked.add(route.request().url());
            route.abort();
        });
        page.navigate("https://scraping-sandbox.netlify.app/products");
        assertThat(page).hasTitle(Pattern.compile("Product Catalog"));
        System.out.println("Blocked " + blocked.size() + " analytics request(s)");
    }
}
