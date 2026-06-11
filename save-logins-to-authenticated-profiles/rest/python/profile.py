# Saves an authenticated browser profile and reuses it across sessions.
# Phase 1 creates a named profile session (use Playwright to log in via CDP).
# Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
#
# Install: pip install requests
# Run:     python profile.py

import requests

TOKEN = 'YOUR_API_TOKEN_HERE'
ORIGIN = 'https://production-sfo.browserless.io'

# Phase 1 – create a named profile session.
session = requests.post(
    f'{ORIGIN}/profile?token={TOKEN}',
    json={'name': 'my-profile'},
).json()

print('Connect URL:', session['connect'])
# Connect a CDP client (Playwright or Puppeteer) to session['connect'],
# complete the login, and call Browserless.saveProfile to persist the session.

# Phase 2 – reuse the saved profile.
response = requests.post(
    f'{ORIGIN}/screenshot?token={TOKEN}&profile=my-profile',
    json={'url': 'https://app.example.com/dashboard'},
)
with open('dashboard.png', 'wb') as f:
    f.write(response.content)
print('Screenshot saved to dashboard.png.')
