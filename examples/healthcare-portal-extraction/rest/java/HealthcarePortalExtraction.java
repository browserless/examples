// Extracts patient medication records from a sandbox healthcare portal using BQL.
//
// Run: javac HealthcarePortalExtraction.java && java HealthcarePortalExtraction

import java.net.URI;
import java.net.http.*;

public class HealthcarePortalExtraction {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/chromium/bql?token=" + token;

        String query = "mutation HealthcarePortal { goto(url: \\"https://scraping-sandbox.netlify.app/clarity-health/patient-portal\\", waitUntil: networkIdle) { status } waitForLogin: waitForSelector(selector: \\"#patient-email\\", timeout: 10000) { time } typeEmail: type(selector: \\"#patient-email\\", text: \\"patient@example.com\\") { time } typePassword: type(selector: \\"#patient-password\\", text: \\"health2025\\") { time } submitLogin: click(selector: \\"#patient-login-submit\\") { time } waitForDashboard: waitForSelector(selector: \\"#medicationlist\\", timeout: 10000) { time } medications: mapSelector(selector: \\"#medicationlist table tbody tr\\") { medication: mapSelector(selector: \\"td:nth-child(1)\\") { innerText } dosage: mapSelector(selector: \\"td:nth-child(2)\\") { innerText } frequency: mapSelector(selector: \\"td:nth-child(3)\\") { innerText } prescriber: mapSelector(selector: \\"td:nth-child(4)\\") { innerText } refills: mapSelector(selector: \\"td:nth-child(5)\\") { innerText } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"HealthcarePortal\"}";

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
