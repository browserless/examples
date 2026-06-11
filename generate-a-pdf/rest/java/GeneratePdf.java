// Generates a PDF from a URL using the Browserless /pdf endpoint.
// java.net.http is included in JDK 11+ — no extra dependency needed.
//
// Run: javac GeneratePdf.java && java GeneratePdf

import java.io.*;
import java.net.URI;
import java.net.http.*;

public class GeneratePdf {
    private static final String TOKEN = "YOUR_API_TOKEN_HERE";

    public static void main(String[] args) throws Exception {
        String endpoint = "https://production-sfo.browserless.io/pdf?token=" + TOKEN;
        String jsonData = """
            {
                "url": "https://example.com",
                "options": {
                    "displayHeaderFooter": true,
                    "printBackground": true,
                    "format": "A4"
                }
            }""";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Cache-Control", "no-cache")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonData))
            .build();

        HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
        try (FileOutputStream fos = new FileOutputStream("output.pdf")) {
            response.body().transferTo(fos);
        }
        System.out.println("PDF saved as output.pdf.");
    }
}
