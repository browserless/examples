// Fills and submits a form using BrowserQL — navigates, types, picks options,
// and clicks submit in a single request.
//
// Requires: Unirest for Java (https://kong.github.io/unirest-java/)
// Run: mvn compile exec:java -Dexec.mainClass="FillForm"

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;

public class FillForm {
    public static void main(String[] args) throws Exception {
        String url = "https://production-sfo.browserless.io/chromium/bql";
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = String.format("%s?token=%s", url, token);

        String query = "mutation FormExample { goto(url: \\\"https://httpbin.org/forms/post\\\", waitUntil: domContentLoaded) { status } typeName: type(selector: \\\"input[name=custname]\\\", text: \\\"Jane Doe\\\") { time } typeEmail: type(selector: \\\"input[name=custemail]\\\", text: \\\"jane@example.com\\\") { time } chooseSize: click(selector: \\\"input[value=medium]\\\") { time } addTopping: checkbox(selector: \\\"input[value=cheese]\\\", checked: true) { time } typeComments: type(selector: \\\"textarea[name=comments]\\\", text: \\\"Hello from Browserless!\\\") { time } submitForm: click(selector: \\\"form button\\\") { time } response: text(selector: \\\"body\\\") { text } }";

        HttpResponse<String> response = Unirest.post(endpoint)
            .header("Content-Type", "application/json")
            .body("{\"query\":\"" + query + "\",\"variables\":{},\"operationName\":\"FormExample\"}")
            .asString();

        System.out.println(response.getBody());
    }
}
