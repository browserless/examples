// Accesses a Cloudflare Access-protected page by injecting Service Token headers
// via network.SetExtraHTTPHeaders before navigation. Headers are sent on every
// subsequent request in the session.
//
// Install: go get github.com/chromedp/chromedp && go get github.com/chromedp/cdproto
// Run:     go run main.go

package main

import (
	"context"
	"fmt"

	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

func main() {
	token := "YOUR_API_TOKEN_HERE"
	ws := fmt.Sprintf("wss://production-sfo.browserless.io?token=%s", token)

	allocCtx, cancel := chromedp.NewRemoteAllocator(context.Background(), ws, chromedp.NoModifyURL)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	var title string
	if err := chromedp.Run(ctx,
		// Enable the network domain before setting headers.
		network.Enable(),
		network.SetExtraHTTPHeaders(network.Headers{
			"CF-Access-Client-Id":     "YOUR_CF_CLIENT_ID.access",
			"CF-Access-Client-Secret": "YOUR_CF_CLIENT_SECRET",
		}),
		chromedp.Navigate("https://internal.example.com/dashboard"),
		chromedp.WaitReady("body"),
		chromedp.Title(&title),
	); err != nil {
		panic(err)
	}

	fmt.Println("Title:", title)
}
