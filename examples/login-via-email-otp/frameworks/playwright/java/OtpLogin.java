// Automates an email OTP login flow using Playwright.
// Navigates to the login page, submits the email to trigger the OTP, waits for
// the OTP field to appear, then reads and enters the code.
//
// Substitute getOtpFromInbox() with your actual inbox API (Mailosaur, Mailslurp,
// Gmail API, IMAP, etc.). Poll after the OTP field appears — not before — to
// avoid reading a stale code from an earlier session.
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

public class OtpLogin {
    static String getOtpFromInbox(String email) {
        // Swap this stub with your actual inbox API.
        throw new UnsupportedOperationException("Implement getOtpFromInbox() with your email provider");
    }

    public static void main(String[] args) {
        String token = "YOUR_API_TOKEN_HERE";
        String wsEndpoint = "wss://production-sfo.browserless.io?token=" + token;

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(wsEndpoint);
            try {
                // Reuse the existing page from the default context so Browserless CDP
                // events are visible on this page object.
                BrowserContext context = browser.contexts().get(0);
                Page page = context.pages().get(0);

                // Submit the email to trigger the OTP — the form changes state before the OTP field appears.
                page.navigate("https://app.example.com/login");
                page.fill("input[type='email']", "user@example.com");
                page.click("button[type='submit']");
                page.waitForSelector("input[name='otp'], input[autocomplete='one-time-code']");

                // Poll the inbox after the OTP field appears, not before — the email may not be sent yet.
                String otp = getOtpFromInbox("user@example.com");
                System.out.println("Got OTP: " + otp);

                page.fill("input[name='otp'], input[autocomplete='one-time-code']", otp);
                page.click("button[type='submit']");
                page.waitForLoadState(LoadState.NETWORKIDLE);
                System.out.println("Logged in. URL: " + page.url());
            } finally {
                // Always close to release the session even on error.
                browser.close();
            }
        }
    }
}
