// Logs into a sandbox vendor portal, lists orders, and extracts invoice download links using BQL.
//
// Run: javac BulkInvoiceDownload.java && java BulkInvoiceDownload

import java.net.URI;
import java.net.http.*;

public class BulkInvoiceDownload {
    public static void main(String[] args) throws Exception {
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = "https://production-sfo.browserless.io/chromium/bql?token=" + token;

        String query = "mutation BulkInvoiceDownload { goto(url: \\"https://scraping-sandbox.netlify.app/harvest-direct/vendor-portal\\", waitUntil: networkIdle) { status } waitForForm: waitForSelector(selector: \\"form\\", timeout: 10000) { time } typeEmail: type(selector: \\"input[name=email]\\", text: \\"demo@example.com\\") { time } typePassword: type(selector: \\"input[name=password]\\", text: \\"helloworld\\") { time } submitLogin: click(selector: \\"button[type=submit]\\") { time } waitForOrders: waitForSelector(selector: \\"table tbody tr\\", timeout: 10000) { time } orders: mapSelector(selector: \\"table tbody tr\\") { orderId: mapSelector(selector: \\"td:nth-child(1)\\") { innerText } date: mapSelector(selector: \\"td:nth-child(2)\\") { innerText } items: mapSelector(selector: \\"td:nth-child(3)\\") { innerText } total: mapSelector(selector: \\"td:nth-child(4)\\") { innerText } status: mapSelector(selector: \\"td:nth-child(5)\\") { innerText } viewLink: mapSelector(selector: \\"td a\\") { href: attribute(name: \\"href\\") { value } } } }";

        String payload = "{\"query\": \"" + query + "\", \"variables\": {}, \"operationName\": \"BulkInvoiceDownload\"}";

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
