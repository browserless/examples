# Navigates to a reCAPTCHA page and solves it using a BQL mutation.
# The solve mutation auto-detects and solves any CAPTCHA on the current page.
#
# Install: pip install requests
# Run:     python captcha.py

import requests

TOKEN = 'YOUR_API_TOKEN_HERE'

query = """mutation SolveCaptcha {
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
}"""

response = requests.post(
    f'https://production-sfo.browserless.io/chromium/bql?token={TOKEN}',
    json={'query': query, 'operationName': 'SolveCaptcha'},
)

result = response.json()
print(result['data']['solve'])
# {'found': True, 'solved': True, 'time': 4800, 'token': '03AGdBq...'}
