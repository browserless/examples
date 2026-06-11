# Contributing

Thanks for adding to this repo. Each use case is a self-contained folder with scripts in multiple languages and frameworks. Follow the conventions below so every example stays consistent and easy to navigate.

## Reporting issues

Use GitHub Issues to report problems or request new content:

- **Bug in a script** — open a [bug report](https://github.com/browserless/examples/issues/new?template=bug_report.md). Include the file path, what you ran, and what went wrong.
- **Missing example or language** — open a [new example request](https://github.com/browserless/examples/issues/new?template=new_example.md).

For questions about the Browserless product itself (API behaviour, billing, account), contact [support](https://www.browserless.io/contact) instead — GitHub Issues on this repo are for the code examples only.

## Submitting changes

This repo requires a pull request to merge into `main` — direct pushes are not allowed. Open a PR from your branch and request a review.

## Folder structure

Each use case lives inside the `examples/` folder, named in `kebab-case` that matches the page title on [docs.browserless.io/examples](https://docs.browserless.io/examples).

```
examples/my-use-case/
├── rest/               # REST API scripts (no persistent browser connection)
│   ├── curl/
│   ├── nodejs/
│   ├── python/
│   ├── java/
│   ├── csharp/
│   ├── go/
│   ├── php/
│   └── ruby/
├── frameworks/         # Browser automation framework scripts
│   ├── puppeteer/
│   ├── playwright/
│   │   ├── nodejs/
│   │   ├── python/
│   │   ├── java/
│   │   └── csharp/
│   └── go/             # chromedp
└── bql/                # BrowserQL mutations (.graphql files)
```

Only create the folders that apply. If a use case has no REST equivalent (e.g. recording requires a WebSocket), skip `rest/`. If there is no BQL equivalent, skip `bql/`.

## File names

| Folder | File name |
| --- | --- |
| `rest/curl/` | `<topic>.sh` |
| `rest/nodejs/` | `<topic>.mjs` |
| `rest/python/` | `<topic>.py` |
| `rest/java/` | `PascalCase.java` (matches the public class name) |
| `rest/csharp/` | `PascalCase.cs` (matches the class name) |
| `rest/go/` | `main.go` |
| `rest/php/` | `<topic>.php` |
| `rest/ruby/` | `<topic>.rb` |
| `frameworks/puppeteer/` | `<topic>.mjs` |
| `frameworks/playwright/nodejs/` | `<topic>.mjs` |
| `frameworks/playwright/python/` | `<topic>.py` |
| `frameworks/playwright/java/` | `PascalCase.java` |
| `frameworks/playwright/csharp/` | `PascalCase.cs` |
| `frameworks/go/` | `main.go` |
| `bql/` | `<topic>.graphql` |

## Script conventions

**Every script must be runnable on its own.** A reader should be able to copy the file, replace `YOUR_API_TOKEN_HERE`, and run it with the command shown in the header comment.

### Header comment

Start every script with a short comment block that includes:
- What the script does (one sentence)
- Any non-obvious caveats or why a specific approach was chosen
- Install command (if dependencies are needed)
- Run command

```js
// Takes a full-page screenshot and saves it to disk.
// Uses Node.js 18+ native fetch — no extra packages needed.
//
// Run: node screenshot.mjs
```

```python
# Takes a full-page screenshot and saves it to disk.
#
# Install: pip install requests
# Run:     python screenshot.py
```

### Token placeholder

Always use the string `YOUR_API_TOKEN_HERE` for the API token. Never commit a real token.

### Endpoint placeholder

Use `production-sfo.browserless.io` as the example endpoint.

### Inline comments

Only add a comment when the **why** is non-obvious — a hidden constraint, a timing invariant, a workaround for a specific behaviour. Don't describe what the code does; well-named variables already do that.

### Error handling

- Always release browser sessions in a `finally` block (or equivalent) so the session is closed even when an error occurs.
- Don't add defensive error handling for scenarios that can't happen in a correct script.

### Credentials

- Read passwords and secrets from environment variables (`process.env.PASSWORD`, `os.environ["PASSWORD"]`), never hardcode them.
- `YOUR_API_TOKEN_HERE` is the one exception — it's a placeholder, not a real secret.

### Node.js

- Use `.mjs` (ESM) for all Node.js scripts.
- Use the native `fetch` API (Node.js 18+) for REST scripts — no `axios` or `node-fetch`.
- Use `puppeteer-core` (not `puppeteer`) for Puppeteer scripts — it skips bundling local browser binaries.
- Use `playwright-core` (not `playwright`) for Playwright scripts — same reason.

### Playwright multi-language

When a Playwright use case has scripts in multiple languages, put each under its own subfolder inside `frameworks/playwright/`:

```
frameworks/playwright/nodejs/   → .mjs
frameworks/playwright/python/   → .py
frameworks/playwright/java/     → PascalCase.java
frameworks/playwright/csharp/   → PascalCase.cs
```

### BQL

- Use `.graphql` files for BQL mutations.
- Include the endpoint as a comment at the top of the file.
- Include a link to the BQL IDE (`https://account.browserless.io/bql`) so readers know they can paste and run it directly.
- If the use case requires two mutations (e.g. reconnect flows), use separate files named to reflect the order: `trigger-otp.graphql` / `enter-otp.graphql`.

## Updating the README

After adding a use case, add a row to the table in `README.md`:

```markdown
| [Title From Docs Page](./examples/folder-name) | One-sentence description | language icons | framework icons |
```

**Language icons** — add one icon per programming language covered across all scripts in the folder. Use 20×20 devicons from the jsDelivr CDN:

```html
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="20" height="20" title="Node.js" />
```

Available language icons:

| Language | Icon name |
| --- | --- |
| Bash / cURL | `bash/bash-original.svg` |
| Node.js | `nodejs/nodejs-original.svg` |
| TypeScript | `typescript/typescript-original.svg` |
| Python | `python/python-original.svg` |
| Java | `java/java-original.svg` |
| C# | `csharp/csharp-original.svg` |
| Go | `go/go-original.svg` |
| PHP | `php/php-original.svg` |
| Ruby | `ruby/ruby-original.svg` |

**Framework icons** — add one icon per framework covered:

| Framework | Icon |
| --- | --- |
| Puppeteer | `chrome/chrome-original.svg` |
| Playwright | `playwright/playwright-original.svg` |
| BQL | `graphql/graphql-plain.svg` |

Keep the rows in the README table alphabetical by use case title.
