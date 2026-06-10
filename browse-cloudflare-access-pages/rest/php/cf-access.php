<?php
// Two approaches for accessing Cloudflare Access-protected pages via the REST API:
//   1. Saved profile — reuse a browser session captured after logging in through CF Access.
//   2. Service Token — inject CF-Access headers via setExtraHTTPHeaders for machine-to-machine access.
//
// Uses PHP's built-in curl — no Composer packages needed.
//
// Run: php cf-access.php

$token = 'YOUR_API_TOKEN_HERE';

// Approach 1: reuse a saved authenticated profile.
$ch = curl_init("https://production-sfo.browserless.io/screenshot?token={$token}&profile=cf-access-profile");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode(['url' => 'https://internal.example.com/dashboard']),
    CURLOPT_RETURNTRANSFER => true,
]);
$png = curl_exec($ch);
curl_close($ch);
file_put_contents('dashboard.png', $png);
echo "Saved dashboard.png\n";

// Approach 2: inject Service Token headers via setExtraHTTPHeaders.
$ch = curl_init("https://production-sfo.browserless.io/content?token={$token}");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode([
        'url'                  => 'https://internal.example.com/dashboard',
        'setExtraHTTPHeaders'  => [
            'CF-Access-Client-Id'     => 'YOUR_CF_CLIENT_ID.access',
            'CF-Access-Client-Secret' => 'YOUR_CF_CLIENT_SECRET',
        ],
    ]),
    CURLOPT_RETURNTRANSFER => true,
]);
$content = curl_exec($ch);
curl_close($ch);
echo substr($content, 0, 200) . "\n";
