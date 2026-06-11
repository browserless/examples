// Fills and submits a form using BrowserQL — navigates, types, selects, solves a CAPTCHA,
// and clicks submit in a single request.
//
// Requires: Unirest for Java (https://kong.github.io/unirest-java/)
// Run: mvn compile exec:java -Dexec.mainClass="FillForm"

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;

public class FillForm {
    public static void main(String[] args) {
        String url = "https://production-sfo.browserless.io/chromium/bql";
        String token = "YOUR_API_TOKEN_HERE";
        String endpoint = String.format("%s?token=%s", url, token);

        HttpResponse<String> response = Unirest.post(endpoint)
            .header("Content-Type", "application/json")
            .body("{\"query\":\"mutation FormExample {\\n"
                + "  goto(url: \\\"https://www.browserless.io/practice-form\\\") {\\n"
                + "    status\\n"
                + "  }\\n"
                + "  typeEmail: type(text: \\\"user@example.com\\\", selector: \\\"#Email\\\") {\\n"
                + "    time\\n"
                + "  }\\n"
                + "  typeMessage: type(selector: \\\"#Message\\\", text: \\\"Hello from Browserless!\\\") {\\n"
                + "    time\\n"
                + "  }\\n"
                + "  subject: select(selector: \\\"select#Subject\\\", value: \\\"Support\\\") {\\n"
                + "    selector\\n"
                + "  }\\n"
                + "  solve {\\n"
                + "    time\\n"
                + "    solved\\n"
                + "  }\\n"
                + "  submitForm: click(selector: \\\"button[type='submit']\\\") {\\n"
                + "    time\\n"
                + "  }\\n"
                + "}\",\"variables\":\"\",\"operationName\":\"FormExample\"}")
            .asString();

        System.out.println(response.getBody());
    }
}
