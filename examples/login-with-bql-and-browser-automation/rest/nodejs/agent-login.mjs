// Automates a login flow using a BQL mutation over HTTP.
// Chains navigation, field detection, typing, CAPTCHA solving, and form submission
// in a single request — no persistent browser connection needed.
//
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
// Run: node agent-login.mjs

const TOKEN = 'YOUR_API_TOKEN_HERE';

const response = await fetch(
  `https://production-sfo.browserless.io/chromium/bql?token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation AgentLogin {
        goto(url: "https://app.example.com/login") {
          status
        }
        waitForSelector(selector: "input[type=email], input[name=email], #email") {
          selector
        }
        typeEmail: type(
          selector: "input[type=email], input[name=email], #email"
          text: "user@example.com"
        ) {
          time
        }
        typePass: type(selector: "input[type=password]", text: "YOUR_PASSWORD") {
          time
        }
        solve {
          found
          solved
        }
        submit: click(selector: "button[type=submit]") {
          time
        }
        waitForNavigation {
          status
        }
      }`,
      operationName: 'AgentLogin',
    }),
  }
);

const result = await response.json();
console.log('Login complete:', result.data);
