// Extracts patient records from a sandbox healthcare portal using BQL.
//
// Run: javac HealthcarePortalExtraction.java && java HealthcarePortalExtraction

import java.net.URI;
import java.net.http.*;

public class HealthcarePortalExtraction {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/chromium/bql?token=" + token;

        String query = "mutation HealthcarePortal { goto(url: \\"https://scraping-sandbox.netlify.app/clarity-health\\", waitUntil: networkIdle) { status } waitForSelector(selector: \\".patient-record\\", timeout: 10000) { time } patients: mapSelector(selector: \\".patient-record\\") { name: mapSelector(selector: \\".patient-name\\") { innerText } dob: mapSelector(selector: \\".patient-dob\\") { innerText } provider: mapSelector(selector: \\".patient-provider\\") { innerText } nextAppt: mapSelector(selector: \\".patient-appointment\\") { innerText } status: mapSelector(selector: \\".patient-status\\") { innerText } } }";

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
