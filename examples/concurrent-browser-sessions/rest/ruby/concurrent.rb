# Captures screenshots of multiple pages concurrently using the Browserless REST API.
# Spawns one thread per URL using Ruby's built-in Thread class.
# Dependencies: net/http, json — both part of the standard library, no gems required.
#
# Run: ruby concurrent.rb

require 'net/http'
require 'json'
require 'uri'

TOKEN = 'YOUR_API_TOKEN_HERE'
URLS = [
  'https://scraping-sandbox.netlify.app/products',
  'https://scraping-sandbox.netlify.app/contact-us',
  'https://scraping-sandbox.netlify.app/receipt',
  'https://scraping-sandbox.netlify.app/dashboard',
  'https://scraping-sandbox.netlify.app/helix',
].freeze

threads = URLS.each_with_index.map do |url, i|
  Thread.new do
    uri = URI("https://production-sfo.browserless.io/screenshot?token=#{TOKEN}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request['Content-Type'] = 'application/json'
    request.body = JSON.generate({ url: url, options: { type: 'png', fullPage: true } })

    response = http.request(request)
    File.binwrite("screenshot-#{i + 1}.png", response.body)
    puts "Saved screenshot-#{i + 1}.png"
  end
end

threads.each(&:join)
puts 'All done'
