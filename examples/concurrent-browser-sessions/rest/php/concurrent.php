<?php
// Captures screenshots of multiple pages concurrently using the Browserless REST API.
// Uses ReactPHP's event loop to run all requests in parallel without spawning threads.
//
// Install: composer require react/http
// Run:     php concurrent.php

require 'vendor/autoload.php';

use React\Http\Browser;
use React\EventLoop\Loop;

$token = 'YOUR_API_TOKEN_HERE';
$urls = [
    'https://scraping-sandbox.netlify.app/products',
    'https://scraping-sandbox.netlify.app/contact-us',
    'https://scraping-sandbox.netlify.app/receipt',
    'https://scraping-sandbox.netlify.app/dashboard',
    'https://scraping-sandbox.netlify.app/helix',
];

$browser = new Browser();
$promises = [];

foreach ($urls as $i => $url) {
    $index = $i + 1;
    $promises[] = $browser
        ->post(
            "https://production-sfo.browserless.io/screenshot?token={$token}",
            ['Content-Type' => 'application/json'],
            json_encode(['url' => $url, 'options' => ['type' => 'png', 'fullPage' => true]])
        )
        ->then(function ($response) use ($index) {
            file_put_contents("screenshot-{$index}.png", (string) $response->getBody());
            echo "Saved screenshot-{$index}.png\n";
        });
}

\React\Promise\all($promises)->then(function () {
    echo "All done\n";
});

Loop::run();
