// Scrapes Glassdoor job listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-glassdoor.mjs

const query = `mutation ScrapeGlassdoor {
  goto(
    url: "https://www.glassdoor.com/Job/new-york-software-engineer-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm"
    waitUntil: networkIdle
  ) {
    status
  }
  jobs: mapSelector(selector: "[data-test='jobListing']") {
    title: mapSelector(selector: "a[data-test='job-title']") {
      innerText
    }
    company: mapSelector(selector: "[data-test='employer-name']") {
      innerText
    }
    location: mapSelector(selector: "[data-test='emp-location']") {
      innerText
    }
    salary: mapSelector(selector: "[data-test='detailSalary']") {
      innerText
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeGlassdoor' }),
  }
);

const { data } = await response.json();
const jobs = data.jobs.map((job) => ({
  title: job.title?.[0]?.innerText ?? '',
  company: job.company?.[0]?.innerText ?? '',
  location: job.location?.[0]?.innerText ?? '',
  salary: job.salary?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(jobs, null, 2));
