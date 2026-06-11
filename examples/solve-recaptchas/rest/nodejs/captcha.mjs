// Navigates to a reCAPTCHA page and solves it using a BQL mutation.
// The solve mutation auto-detects and solves any CAPTCHA on the current page.
//
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
// Run: node captcha.mjs

const TOKEN = 'YOUR_API_TOKEN_HERE';

const response = await fetch(
  `https://production-sfo.browserless.io/chromium/bql?token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation SolveCaptcha {
        goto(url: "https://www.google.com/recaptcha/api2/demo") {
          status
        }
        solve {
          found
          solved
          time
          token
        }
        submit: click(selector: "#recaptcha-demo-submit") {
          time
        }
      }`,
      operationName: 'SolveCaptcha',
    }),
  }
);

const result = await response.json();
console.log(result.data.solve);
// { found: true, solved: true, time: 4800, token: '03AGdBq...' }
