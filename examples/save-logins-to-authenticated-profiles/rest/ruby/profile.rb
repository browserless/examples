# Saves an authenticated browser profile and reuses it across sessions.
# Phase 1 creates a named profile session (use a CDP client to log in and save).
# Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
#
# Run: ruby profile.rb

require 'net/http'
require 'json'
require 'uri'

TOKEN = 'YOUR_API_TOKEN_HERE'
ORIGIN = 'https://production-sfo.browserless.io'

# Phase 1 – create a named profile session.
uri = URI("#{ORIGIN}/profile?token=#{TOKEN}")
response = Net::HTTP.post(uri, '{"name": "my-profile"}', 'Content-Type' => 'application/json')
session = JSON.parse(response.body)
puts "Connect URL: #{session['connect']}"
# Use session['connect'] with a CDP client (Puppeteer or Playwright) to log in
# and call Browserless.saveProfile to persist the session.

# Phase 2 – reuse the saved profile.
uri2 = URI("#{ORIGIN}/screenshot?token=#{TOKEN}&profile=my-profile")
response2 = Net::HTTP.post(uri2, '{"url": "https://app.example.com/dashboard"}', 'Content-Type' => 'application/json')
File.binwrite('dashboard.png', response2.body)
puts 'Screenshot saved to dashboard.png.'
