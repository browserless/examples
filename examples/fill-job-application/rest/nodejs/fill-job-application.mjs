// Fills and submits a job application form on a sandbox site using BQL.
//
// Run: node fill-job-application.mjs

const query = `mutation FillJobApplication {
  goto(url: "https://scraping-sandbox.netlify.app/helix", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "form", timeout: 10000) {
    time
  }
  typeName: type(selector: "input[name=name]", text: "Jane Smith") {
    time
  }
  typeEmail: type(selector: "input[name=email]", text: "jane@example.com") {
    time
  }
  typePhone: type(selector: "input[name=phone]", text: "555-123-4567") {
    time
  }
  selectDept: select(selector: "select[name=department]", value: "Engineering") {
    selector
  }
  typeMessage: type(selector: "textarea[name=message]", text: "Excited to contribute to the team!") {
    time
  }
  submit: click(selector: "button[type=submit]") {
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
