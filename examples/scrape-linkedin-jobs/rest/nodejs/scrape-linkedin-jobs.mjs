// Scrapes LinkedIn job listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-linkedin-jobs.mjs

const query = `mutation ScrapeLinkedInJobs {
  goto(url: "https://www.linkedin.com/jobs/search/?keywords=software+engineer&location=United+States", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ".base-card", timeout: 15000) {
    time
  }
  jobs: mapSelector(selector: ".base-card") {
    title: mapSelector(selector: ".base-search-card__title") { innerText }
    company: mapSelector(selector: ".base-search-card__subtitle a") { innerText }
    location: mapSelector(selector: ".job-search-card__location") { innerText }
    posted: mapSelector(selector: "time") { innerText }
    link: mapSelector(selector: "a.base-card__full-link") {
      href: attribute(name: "href") { value }
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeLinkedInJobs' }),
  }
);

const { data } = await response.json();
const jobs = data.jobs.map((j) => ({
  title: j.title?.[0]?.innerText ?? '',
  company: j.company?.[0]?.innerText ?? '',
  location: j.location?.[0]?.innerText ?? '',
  posted: j.posted?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(jobs, null, 2));
