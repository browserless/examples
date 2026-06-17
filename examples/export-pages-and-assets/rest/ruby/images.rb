# Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
# using the Browserless /export endpoint.
# Uses net/http and json from the standard library — no gems required.
#
# Run: ruby images.rb

require 'net/http'
require 'json'
require 'uri'

TOKEN = 'YOUR_API_TOKEN_HERE'

uri = URI("https://production-sfo.browserless.io/export?token=#{TOKEN}")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request.body = JSON.generate({ url: 'https://example.com', includeResources: true })

response = http.request(request)

File.binwrite('page.zip', response.body)
puts 'Saved page.zip'
