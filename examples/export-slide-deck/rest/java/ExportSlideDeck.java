// Exports a Google Slides presentation as a PDF using Browserless.
//
// Run: javac ExportSlideDeck.java && java ExportSlideDeck

import java.net.URI;
import java.net.http.*;
import java.nio.file.*;

public class ExportSlideDeck {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String presentationId = "YOUR_PRESENTATION_ID";
        String endpoint = "https://production-sfo.browserless.io/pdf?token=" + token;

        String payload = "{"
            + "\"url\": \"https://docs.google.com/presentation/d/" + presentationId + "/export/pdf\","
            + "\"options\": {\"printBackground\": true, \"format\": \"A4\", \"landscape\": true}"
            + "}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
        Files.write(Path.of("slide-deck.pdf"), response.body());
        System.out.println("Exported to slide-deck.pdf");
    }
}
