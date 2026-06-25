// Extracts patient medication records from a sandbox healthcare portal using BQL.
//
// Run: node healthcare-portal-extraction.mjs

const query = `mutation HealthcarePortal {
  goto(url: "https://scraping-sandbox.netlify.app/clarity-health/patient-portal", waitUntil: networkIdle) {
    status
  }
  waitForLogin: waitForSelector(selector: "#patient-email", timeout: 10000) {
    time
  }
  typeEmail: type(selector: "#patient-email", text: "patient@example.com") {
    time
  }
  typePassword: type(selector: "#patient-password", text: "health2025") {
    time
  }
  submitLogin: click(selector: "#patient-login-submit") {
    time
  }
  waitForDashboard: waitForSelector(selector: "#medicationlist", timeout: 10000) {
    time
  }
  medications: mapSelector(selector: "#medicationlist table tbody tr") {
    medication: mapSelector(selector: "td:nth-child(1)") { innerText }
    dosage: mapSelector(selector: "td:nth-child(2)") { innerText }
    frequency: mapSelector(selector: "td:nth-child(3)") { innerText }
    prescriber: mapSelector(selector: "td:nth-child(4)") { innerText }
    refills: mapSelector(selector: "td:nth-child(5)") { innerText }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'HealthcarePortal' }),
  }
);

const { data } = await response.json();
const medications = data.medications.map((row) => ({
  medication: row.medication?.[0]?.innerText ?? '',
  dosage: row.dosage?.[0]?.innerText ?? '',
  frequency: row.frequency?.[0]?.innerText ?? '',
  prescriber: row.prescriber?.[0]?.innerText ?? '',
  refills: row.refills?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(medications, null, 2));
