# Two approaches for accessing Cloudflare Access-protected pages via the REST API:
#   1. Saved profile — reuse a browser session captured after logging in through CF Access.
#   2. Service Token — inject CF-Access headers via setExtraHTTPHeaders for machine-to-machine access.
#
# Uses net/http and json from the standard library — no gems required.
#
# Run: ruby cf-access.rb

require 'net/http'
require 'json'
require 'uri'

TOKEN = 'YOUR_API_TOKEN_HERE'

# Approach 1: reuse a saved authenticated profile.
profile_uri = URI("https://production-sfo.browserless.io/screenshot?token=#{TOKEN}&profile=cf-access-profile")
http = Net::HTTP.new(profile_uri.host, profile_uri.port)
http.use_ssl = true
profile_req = Net::HTTP::Post.new(profile_uri)
profile_req['Content-Type'] = 'application/json'
profile_req.body = JSON.generate({ url: 'https://internal.example.com/dashboard' })
profile_res = http.request(profile_req)
File.binwrite('dashboard.png', profile_res.body)
puts 'Saved dashboard.png'

# Approach 2: inject Service Token headers via setExtraHTTPHeaders.
token_uri = URI("https://production-sfo.browserless.io/content?token=#{TOKEN}")
http = Net::HTTP.new(token_uri.host, token_uri.port)
http.use_ssl = true
token_req = Net::HTTP::Post.new(token_uri)
token_req['Content-Type'] = 'application/json'
token_req.body = JSON.generate({
  url: 'https://internal.example.com/dashboard',
  setExtraHTTPHeaders: {
    'CF-Access-Client-Id'     => 'YOUR_CF_CLIENT_ID.access',
    'CF-Access-Client-Secret' => 'YOUR_CF_CLIENT_SECRET',
  },
})
token_res = http.request(token_req)
puts token_res.body[0, 200]
