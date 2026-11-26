// Playwright configuration for running tests against a remote Browserless browser.
// Reads your API token from the BROWSERLESS_TOKEN environment variable.
//
// Run: BROWSERLESS_TOKEN=YOUR_API_TOKEN_HERE npx playwright test

import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 4,
  retries: 1,
  use: {
    trace: 'on-first-retry',
    connectOptions: {
      wsEndpoint: `wss://production-sfo.browserless.io/chromium/playwright?token=${process.env.BROWSERLESS_TOKEN}`,
    },
  },
});
