# Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_booking.py

from datetime import date, timedelta

import requests

# Booking.com only shows prices for future stays, so search 30 days from today.
checkin = date.today() + timedelta(days=30)
checkout = checkin + timedelta(days=1)
url = (
    'https://www.booking.com/searchresults.html?ss=New+York'
    f'&checkin={checkin}&checkout={checkout}&group_adults=2'
)

query = """
mutation ScrapeBooking($url: String!) {
  goto(url: $url, waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-testid='property-card']", timeout: 30000) {
    time
  }
  hotels: mapSelector(selector: "[data-testid='property-card']") {
    name: mapSelector(selector: "[data-testid='title']") {
      innerText
    }
    price: mapSelector(selector: "[data-testid='price-and-discounted-price']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='review-score'] [aria-hidden='true']") {
      innerText
    }
    location: mapSelector(selector: "[data-testid='address-link']") {
      innerText
    }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxyCountry': 'us',
    },
    json={'query': query, 'variables': {'url': url}},
)

data = response.json()['data']
for hotel in data['hotels']:
    name = hotel['name'][0]['innerText'] if hotel['name'] else ''
    price = hotel['price'][0]['innerText'] if hotel['price'] else ''
    rating = hotel['rating'][0]['innerText'] if hotel['rating'] else ''
    location = hotel['location'][0]['innerText'] if hotel['location'] else ''
    print(f'{name} — {price} — {rating} — {location}')
