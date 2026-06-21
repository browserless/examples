# Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_booking.py

import requests

query = """
mutation ScrapeBooking {
  goto(
    url: "https://www.booking.com/searchresults.html?ss=New+York&checkin=2025-09-01&checkout=2025-09-07&group_adults=2"
    waitUntil: networkIdle
  ) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  hotels: mapSelector(selector: "[data-testid='property-card']") {
    name: mapSelector(selector: "[data-testid='title']") {
      innerText
    }
    price: mapSelector(selector: "[data-testid='price-and-discounted-price']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='review-score']") {
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeBooking'},
)

data = response.json()['data']
for hotel in data['hotels']:
    name = hotel['name'][0]['innerText'] if hotel['name'] else ''
    price = hotel['price'][0]['innerText'] if hotel['price'] else ''
    rating = hotel['rating'][0]['innerText'] if hotel['rating'] else ''
    print(f'{name} — {price} — {rating}')
