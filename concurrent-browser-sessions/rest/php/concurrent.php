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
    'https://example.com/page/1',
    'https://example.com/page/2',
    'https://example.com/page/3',
    'https://example.com/page/4',
    'https://example.com/page/5',
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
