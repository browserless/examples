# Exports a Google Slides presentation as a PDF using Browserless.
#
# Install: pip install requests
# Run:     python export_slide_deck.py

import requests

PRESENTATION_ID = 'YOUR_PRESENTATION_ID'
TOKEN = 'YOUR_API_TOKEN_HERE'

response = requests.post(
    f'https://production-sfo.browserless.io/pdf?token={TOKEN}',
    json={
        'url': f'https://docs.google.com/presentation/d/{PRESENTATION_ID}/export/pdf',
        'options': {
            'printBackground': True,
            'format': 'A4',
            'landscape': True,
        },
    },
)

with open('slide-deck.pdf', 'wb') as f:
    f.write(response.content)

print('Exported to slide-deck.pdf')
