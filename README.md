# Browserless Examples

Runnable code examples for common [Browserless](https://docs.browserless.io/examples) use cases. 

## Prerequisites

- A Browserless API token — find it in your [account dashboard](https://account.browserless.io)
- A regional endpoint, for example `production-sfo.browserless.io`
- Replace `YOUR_API_TOKEN_HERE` in any script with your token before running

## Use cases

| Use case | Description |
| --- | --- |
| [Auto-Accept Cookie Consent Banners](./auto-accept-cookie-banners) | Detect and dismiss cookie consent banners before scraping or capturing a page |
| [Basic Playwright Connection](./basic-playwright-connection) | Connect an existing Playwright script to Browserless by swapping `chromium.launch()` for `connectOverCDP()` |
| [Browse Cloudflare Access-Protected Pages](./browse-cloudflare-access-pages) | Access pages protected by Cloudflare Access zero-trust policies using Service Token headers or a saved authenticated profile |
| [Run Concurrent Browser Sessions](./concurrent-browser-sessions) | Launch multiple independent browser sessions in parallel to speed up large-scale scraping or automation |
| [Extract and Download Images](./extract-download-images) | Find all images on a page and download them to disk, including JS-rendered content |
| [Record a Browser Session](./record-browser-session) | Capture a browser session as a `.webm` video file using the Browserless recording API |
| [Solving Cloudflare Challenges](./solve-cloudflare-challenges) | Bypass Cloudflare Turnstile and JS challenges using the `/unblock` endpoint or BQL's `solve` mutation |
