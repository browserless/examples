// Records a browser session as a .webm file using Browserless CDP commands.
// Must reuse the existing context and page from connectOverCDP — creating new ones
// starts a fresh session that isn't wired to the recording.
//
// Add to pom.xml:
//   <dependency>
//     <groupId>com.microsoft.playwright</groupId>
//     <artifactId>playwright</artifactId>
//     <version>1.44.0</version>
//   </dependency>
//
// Run: mvn exec:java

import com.microsoft.playwright.*;
import java.nio.file.*;
import java.util.Base64;
import java.util.Map;

public class ScreenRecording {
    public static void main(String[] args) throws Exception {
        String TOKEN = "YOUR_API_TOKEN_HERE";
        String WS_ENDPOINT = String.format(
            "wss://production-sfo.browserless.io?token=%s&headless=false&stealth&record=true",
            TOKEN
        );

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().connectOverCDP(WS_ENDPOINT);
            try {
                // Reuse the existing context and page — new ones won't be wired to the recording.
                BrowserContext context = browser.contexts().get(0);
                Page page = context.pages().get(0);

                // Set viewport before starting — dimensions are fixed for the entire recording.
                page.setViewportSize(1280, 720);

                CDPSession cdpSession = context.newCDPSession(page);
                cdpSession.send("Browserless.startRecording", null);

                page.navigate("https://example.com");
                Thread.sleep(5000);

                page.navigate("https://example.com/about");
                Thread.sleep(5000);

                // base64 encoding is required — CDP can't transfer raw binary over its text protocol.
                var response = cdpSession.send(
                    "Browserless.stopRecording",
                    Map.of("encoding", "base64")
                );
                var valueElement = response.get("value");
                if (valueElement == null) throw new IllegalStateException("stopRecording response missing 'value'");
                byte[] data = Base64.getDecoder().decode(valueElement.getAsString());
                Files.write(Paths.get("recording.webm"), data);

                System.out.println("Recording saved to recording.webm");
            } finally {
                browser.close();
            }
        }
    }
}
