// Fills and submits a job application form on a sandbox site using BQL.
//
// Run: javac FillJobApplication.java && java FillJobApplication

import java.net.URI;
import java.net.http.*;

public class FillJobApplication {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/chromium/bql?token=" + token;

        String query = "mutation FillJobApplication { goto(url: \\"https://scraping-sandbox.netlify.app/helix/software-engineer-pipelines\\", waitUntil: networkIdle) { status } clickApplicationTab: click(selector: \\"button:nth-child(2)\\") { time } waitForInputs: waitForSelector(selector: \\"input[type=text]\\", timeout: 10000) { time } typeName: type(selector: \\"input[type=text]\\", text: \\"Jane Smith\\") { time } typeEmail: type(selector: \\"input[type=email]\\", text: \\"jane@example.com\\") { time } typeMessage: type(selector: \\"textarea\\", text: \\"Excited to contribute to the team!\\") { time } submit: click(selector: \\"div > button:only-of-type\\") { time } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"FillJobApplication\"}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}
