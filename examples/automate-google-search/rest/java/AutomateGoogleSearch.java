// Searches Google and extracts result headings using the Browserless /scrape endpoint.
// java.net.http is included in JDK 11+. Gson is used only for JSON parsing.
// Note: Google may block or CAPTCHA this request — use BQL for more reliable results.
//
// Add to pom.xml:
//   <dependency>
//     <groupId>com.google.code.gson</groupId>
//     <artifactId>gson</artifactId>
//     <version>2.10.1</version>
//   </dependency>
//
// Run: javac AutomateGoogleSearch.java && java AutomateGoogleSearch

import com.google.gson.*;
import java.net.URI;
import java.net.http.*;
import java.util.*;

public class AutomateGoogleSearch {
    private static final String TOKEN = "YOUR_API_TOKEN_HERE";

    public static void main(String[] args) throws Exception {
        String endpoint = "https://production-sfo.browserless.io/scrape?token=" + TOKEN;
        String jsonData = """
            {
                "url": "https://www.google.com/search?q=Browserless+headless+browser",
                "elements": [{ "selector": "h3" }]
            }""";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonData))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonArray results = JsonParser.parseString(response.body())
            .getAsJsonObject()
            .getAsJsonArray("data")
            .get(0).getAsJsonObject()
            .getAsJsonArray("results");

        List<String> titles = new ArrayList<>();
        for (JsonElement r : results) {
            titles.add(r.getAsJsonObject().get("text").getAsString());
        }
        System.out.println(titles);
    }
}
