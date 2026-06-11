<?php
// Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
// proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
// harder to bypass from datacenter IPs.
//
// Uses PHP's built-in curl — no Composer packages needed.
// Run: php unblock.php

$token = 'YOUR_API_TOKEN_HERE';

$ch = curl_init("https://production-sfo.browserless.io/unblock?token={$token}&proxy=residential");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode([
        'url'              => 'https://example-cloudflare-protected.com',
        'content'          => true,
        'cookies'          => false,
        'screenshot'       => false,
        'browserWSEndpoint' => false,
    ]),
    CURLOPT_RETURNTRANSFER => true,
]);
$body = curl_exec($ch);
curl_close($ch);

$data = json_decode($body, true);
echo substr($data['content'], 0, 500) . "\n";
