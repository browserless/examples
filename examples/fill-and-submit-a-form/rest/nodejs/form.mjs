// Fills and submits a form using BrowserQL — navigates, types, picks options,
// and clicks submit in a single request.
//
// Run: node form.mjs

const query = `
mutation FormExample {
  goto(url: "https://httpbin.org/forms/post", waitUntil: domContentLoaded) {
    status
  }
  typeName: type(selector: "input[name=custname]", text: "Jane Doe") {
    time
  }
  typeEmail: type(selector: "input[name=custemail]", text: "jane@example.com") {
    time
  }
  chooseSize: click(selector: "input[value=medium]") {
    time
  }
  addTopping: checkbox(selector: "input[value=cheese]", checked: true) {
    time
  }
  typeComments: type(selector: "textarea[name=comments]", text: "Hello from Browserless!") {
    time
  }
  submitForm: click(selector: "form button") {
    time
  }
  response: text(selector: "body") {
    text
  }
}
`;

const response = await fetch(
  'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'FormExample' }),
  }
);

const { data } = await response.json();
// httpbin echoes the submission as JSON; `form` holds the posted fields.
console.log(JSON.parse(data.response.text).form);
