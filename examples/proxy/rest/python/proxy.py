# Routes browser traffic through a residential proxy and logs the resulting IP.
#
# Install: pip install requests
# Run:     python proxy.py

import requests
import json

response = requests.post(
    'https://production-sfo.browserless.io/scrape',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxyCountry': 'us',
    },
    json={
        'url': 'https://api.ipify.org?format=json',
        'elements': [{'selector': 'body'}],
    },
)

data = response.json()['data']
ip = json.loads(data[0]['results'][0]['text'])['ip']
print('Proxy IP:', ip)
