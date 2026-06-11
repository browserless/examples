<?php
// Logs in once and reuses that authenticated state across future sessions.
// Phase 1 creates a named profile session (use a CDP client to log in and save).
// Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
//
// Run: php session.php

$TOKEN = 'YOUR_API_TOKEN_HERE';
$ORIGIN = 'https://production-sfo.browserless.io';

// Phase 1 – create a named profile session.
$ch = curl_init("{$ORIGIN}/profile?token={$TOKEN}");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => '{"name": "my-profile"}',
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
]);
$session = json_decode(curl_exec($ch), true);
curl_close($ch);
echo 'Connect URL: ' . $session['connect'] . PHP_EOL;
// Use $session['connect'] with a CDP client (Puppeteer or Playwright) to log in
// and call Browserless.saveProfile to persist the session.

// Phase 2 – reuse the saved profile.
$ch2 = curl_init("{$ORIGIN}/screenshot?token={$TOKEN}&profile=my-profile");
curl_setopt_array($ch2, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => '{"url": "https://app.example.com/dashboard"}',
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
]);
file_put_contents('dashboard.png', curl_exec($ch2));
curl_close($ch2);
echo 'Screenshot saved to dashboard.png.' . PHP_EOL;
