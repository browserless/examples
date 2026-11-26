#!/usr/bin/env bash
# Fills and submits a form using BrowserQL — navigates, types, picks options,
# and clicks submit in a single request.
#
# Run: bash form.sh

curl -X POST \
  "https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation FormExample { goto(url: \"https://httpbin.org/forms/post\", waitUntil: domContentLoaded) { status } typeName: type(selector: \"input[name=custname]\", text: \"Jane Doe\") { time } typeEmail: type(selector: \"input[name=custemail]\", text: \"jane@example.com\") { time } chooseSize: click(selector: \"input[value=medium]\") { time } addTopping: checkbox(selector: \"input[value=cheese]\", checked: true) { time } typeComments: type(selector: \"textarea[name=comments]\", text: \"Hello from Browserless!\") { time } submitForm: click(selector: \"form button\") { time } response: text(selector: \"body\") { text } }",
    "variables": {},
    "operationName": "FormExample"
  }'
