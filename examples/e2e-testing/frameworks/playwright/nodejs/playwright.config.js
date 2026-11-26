// Playwright configuration for running tests against a remote Browserless browser.
// Run: npx playwright test

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
