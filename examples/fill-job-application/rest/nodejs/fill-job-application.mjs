// Fills and submits a job application form on a sandbox site using BQL.
//
// Run: node fill-job-application.mjs

const query = `mutation FillJobApplication {
  goto(url: "https://scraping-sandbox.netlify.app/helix/software-engineer-pipelines", waitUntil: networkIdle) {
    status
  }
  clickApplicationTab: click(selector: "button:nth-child(2)") {
    time
  }
  waitForInputs: waitForSelector(selector: "input[type=text]", timeout: 10000) {
    time
  }
  typeName: type(selector: "input[type=text]", text: "Jane Smith") {
    time
  }
  typeEmail: type(selector: "input[type=email]", text: "jane@example.com") {
    time
  }
  typeMessage: type(selector: "textarea", text: "Excited to contribute to the team!") {
    time
  }
  submit: click(selector: "div > button:only-of-type") {
    time
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'FillJobApplication' }),
  }
);

const result = await response.json();
console.log(JSON.stringify(result, null, 2));
