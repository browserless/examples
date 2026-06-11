# Generates a PDF from a URL using the Browserless /pdf endpoint.
#
# Install: pip install requests
# Run:     python pdf.py

import requests

response = requests.post(
    'https://production-sfo.browserless.io/pdf?token=YOUR_API_TOKEN_HERE',
    headers={'Cache-Control': 'no-cache', 'Content-Type': 'application/json'},
    json={
        'url': 'https://example.com',
        'options': {
            'displayHeaderFooter': True,
            'printBackground': True,
            'format': 'A4',
        },
    },
)
with open('output.pdf', 'wb') as f:
    f.write(response.content)
print('PDF saved as output.pdf.')
