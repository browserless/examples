<?php
// Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
// then downloads each image to an images/ directory.
// Uses PHP's built-in curl and file_get_contents — no Composer packages needed.
//
// Run: php images.php

$token = 'YOUR_API_TOKEN_HERE';

$ch = curl_init('https://production-sfo.browserless.io/scrape?token=' . $token);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode([
        'url'      => 'https://example.com',
        'elements' => [['selector' => 'img', 'timeout' => 5000]],
    ]),
    CURLOPT_RETURNTRANSFER => true,
]);
$body = curl_exec($ch);
curl_close($ch);

$data = json_decode($body, true);

// src is nested inside each result's attributes array.
$imageUrls = [];
foreach ($data['data'][0]['results'] as $result) {
    foreach ($result['attributes'] as $attr) {
        if ($attr['name'] === 'src' && str_starts_with($attr['value'], 'http')) {
            $imageUrls[] = $attr['value'];
        }
    }
}

echo 'Found ' . count($imageUrls) . " images\n";
mkdir('images', 0755, true);

foreach ($imageUrls as $i => $url) {
    $imageData = file_get_contents($url);
    $ext = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
    $filename = "images/image-{$i}.{$ext}";
    file_put_contents($filename, $imageData);
    echo "Saved {$filename}\n";
}
