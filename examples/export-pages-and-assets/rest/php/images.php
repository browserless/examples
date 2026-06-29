<?php
// Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
// using the Browserless /export endpoint.
// Uses PHP's built-in curl — no Composer packages needed.
//
// Run: php images.php

$token = 'YOUR_API_TOKEN_HERE';

$ch = curl_init('https://production-sfo.browserless.io/export?token=' . $token);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode([
        'url'              => 'https://scraping-sandbox.netlify.app/harvest-direct',
        'includeResources' => true,
    ]),
    CURLOPT_RETURNTRANSFER => true,
]);
$body = curl_exec($ch);
curl_close($ch);

file_put_contents('page.zip', $body);
echo "Saved page.zip\n";
