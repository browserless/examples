# Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
# proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
# harder to bypass from datacenter IPs.
#
# Uses net/http and json from the standard library — no gems required.
# Run: ruby unblock.rb

require 'net/http'
require 'json'
require 'uri'

TOKEN = 'YOUR_API_TOKEN_HERE'

uri = URI("https://production-sfo.browserless.io/unblock?token=#{TOKEN}&proxy=residential")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request.body = JSON.generate({
  url: 'https://example-cloudflare-protected.com',
  content: true,
  cookies: false,
  screenshot: false,
  browserWSEndpoint: false,
})

response = http.request(request)
data = JSON.parse(response.body)
puts data['content'][0, 500]
