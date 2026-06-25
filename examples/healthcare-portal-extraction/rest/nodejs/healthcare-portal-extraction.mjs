// Extracts patient records from a sandbox healthcare portal using BQL.
//
// Run: node healthcare-portal-extraction.mjs

const query = `mutation HealthcarePortal {
  goto(url: "https://scraping-sandbox.netlify.app/clarity-health", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ".patient-record", timeout: 10000) {
    time
  }
  patients: mapSelector(selector: ".patient-record") {
    name: mapSelector(selector: ".patient-name") { innerText }
    dob: mapSelector(selector: ".patient-dob") { innerText }
    provider: mapSelector(selector: ".patient-provider") { innerText }
    nextAppt: mapSelector(selector: ".patient-appointment") { innerText }
    status: mapSelector(selector: ".patient-status") { innerText }
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
const patients = data.patients.map((p) => ({
  name: p.name?.[0]?.innerText ?? '',
  dob: p.dob?.[0]?.innerText ?? '',
  provider: p.provider?.[0]?.innerText ?? '',
  nextAppt: p.nextAppt?.[0]?.innerText ?? '',
  status: p.status?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(patients, null, 2));
