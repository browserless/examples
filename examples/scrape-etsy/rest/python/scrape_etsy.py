# Scrapes Etsy product titles and prices from search results.
#
# Install: pip install requests
# Run:     python scrape_etsy.py

import requests

response = requests.post(
    'https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE',
    json={
        'url': 'https://www.etsy.com/search?q=candles',
        'elements': [
            {'selector': '.v2-listing-card h3'},
            {'selector': '.v2-listing-card .currency-value'},
        ],
    },
)

data = response.json()['data']
titles = [item['text'] for item in data[0]['results']]
prices = [item['text'] for item in data[1]['results']]
for title, price in zip(titles, prices):
    print(f'{title}: ${price}')
