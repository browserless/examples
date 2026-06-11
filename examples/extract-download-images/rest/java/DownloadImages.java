// Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
// then downloads each image to an images/ directory.
// Uses java.net.http.HttpClient (Java 11+) and Gson for JSON parsing.
//
// Add to pom.xml:
//   <dependency>
//     <groupId>com.google.code.gson</groupId>
//     <artifactId>gson</artifactId>
//     <version>2.10.1</version>
//   </dependency>
//
// Compile: javac DownloadImages.java
// Run:     java DownloadImages

import com.google.gson.*;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;

public class DownloadImages {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        HttpClient client = HttpClient.newHttpClient();

        String body = "{\"url\":\"https://example.com\",\"elements\":[{\"selector\":\"img\",\"timeout\":5000}]}";
        HttpRequest scrapeReq = HttpRequest.newBuilder()
            .uri(URI.create("https://production-sfo.browserless.io/scrape?token=" + token))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        HttpResponse<String> scrapeRes = client.send(scrapeReq, HttpResponse.BodyHandlers.ofString());
        JsonObject json = JsonParser.parseString(scrapeRes.body()).getAsJsonObject();
        JsonArray results = json.getAsJsonArray("data").get(0)
            .getAsJsonObject().getAsJsonArray("results");

        Files.createDirectories(Path.of("images"));
        int i = 0;

        for (JsonElement resultEl : results) {
            for (JsonElement attrEl : resultEl.getAsJsonObject().getAsJsonArray("attributes")) {
                JsonObject attr = attrEl.getAsJsonObject();
                String name = attr.get("name").getAsString();
                String value = attr.get("value").getAsString();

                if ("src".equals(name) && value.startsWith("http")) {
                    HttpRequest imgReq = HttpRequest.newBuilder()
                        .uri(URI.create(value)).build();
                    HttpResponse<byte[]> imgRes = client.send(imgReq, HttpResponse.BodyHandlers.ofByteArray());

                    // Use URI.getPath() to strip query strings before extracting the extension.
                    String urlPath = URI.create(value).getPath();
                    int dot = urlPath.lastIndexOf('.');
                    String ext = dot >= 0 ? urlPath.substring(dot) : ".jpg";

                    Files.write(Path.of("images/image-" + i + ext), imgRes.body());
                    System.out.println("Saved images/image-" + i + ext);
                    i++;
                }
            }
        }
    }
}
