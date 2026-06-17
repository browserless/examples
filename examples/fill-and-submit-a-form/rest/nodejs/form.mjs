// Fills and submits a form using BrowserQL — navigates, types, selects, solves a CAPTCHA,
// and clicks submit in a single request.
//
// Run: node form.mjs

const response = await fetch(
  'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation FormExample {
        goto(url: "https://www.browserless.io/practice-form") {
          status
        }
        typeEmail: type(text: "user@example.com", selector: "#Email") {
          time
        }
        typeMessage: type(selector: "#Message", text: "Hello from Browserless!") {
          time
        }
        subject: select(selector: "select#Subject", value: "Support") {
          selector
        }
        solve {
          time
          solved
        }
        submitForm: click(selector: "button[type='submit']") {
          time
        }
      }`,
      variables: {},
      operationName: 'FormExample',
    }),
  }
);
const result = await response.json();
console.log(result);
