# Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
# then downloads each image to an images/ directory.
# Uses net/http, json, and fileutils from the standard library — no gems required.
#
# Run: ruby images.rb

require 'net/http'
require 'json'
require 'uri'
require 'fileutils'

TOKEN = 'YOUR_API_TOKEN_HERE'

scrape_uri = URI("https://production-sfo.browserless.io/scrape?token=#{TOKEN}")
http = Net::HTTP.new(scrape_uri.host, scrape_uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(scrape_uri)
request['Content-Type'] = 'application/json'
request.body = JSON.generate({
  url: 'https://example.com',
  elements: [{ selector: 'img', timeout: 5000 }]
})

response = http.request(request)
data = JSON.parse(response.body)

# src is nested inside each result's attributes array.
image_urls = data['data'][0]['results']
  .flat_map { |r| r['attributes'] }
  .select { |a| a['name'] == 'src' && a['value'].start_with?('http') }
  .map { |a| a['value'] }

puts "Found #{image_urls.size} images"
FileUtils.mkdir_p('images')

image_urls.each_with_index do |url, i|
  image_data = Net::HTTP.get(URI(url))
  ext = File.extname(URI(url).path)
  ext = '.jpg' if ext.empty?
  filename = "images/image-#{i}#{ext}"
  File.binwrite(filename, image_data)
  puts "Saved #{filename}"
end
