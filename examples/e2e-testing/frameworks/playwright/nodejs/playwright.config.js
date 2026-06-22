// Playwright configuration for running tests against a remote Browserless browser.
// Run: npx playwright test

import { defineConfig } from '@playwright/test';

const TOKEN = process.env.BROWSERLESS_TOKEN ?? 'YOUR_API_TOKEN_HERE';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: {
    connectOptions: {
      wsEndpoint: `wss://production-sfo.browserless.io/chromium/playwright?token=${TOKEN}`,
    },
  },
});
