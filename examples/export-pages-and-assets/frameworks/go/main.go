// Exports a page's HTML and linked assets (CSS, JS, images) to a local directory
// by navigating to the page and downloading each referenced resource.
//
// Install: go get github.com/chromedp/chromedp
// Run:     go run main.go

package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/chromedp/chromedp"
)

func main() {
	token := "YOUR_API_TOKEN_HERE"
	ws := fmt.Sprintf("wss://production-sfo.browserless.io?token=%s", token)

	allocCtx, cancel := chromedp.NewRemoteAllocator(context.Background(), ws, chromedp.NoModifyURL)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	var html string
	var resourceURLs []string

	if err := chromedp.Run(ctx,
		chromedp.Navigate("https://scraping-sandbox.netlify.app/harvest-direct"),
		chromedp.WaitReady("body"),
		chromedp.OuterHTML("html", &html),
		chromedp.Evaluate(`[
			...Array.from(document.querySelectorAll('link[href]'), el => el.href),
			...Array.from(document.querySelectorAll('script[src]'), el => el.src),
			...Array.from(document.querySelectorAll('img[src]'), el => el.src),
		].filter(url => url.startsWith('http'))`, &resourceURLs),
	); err != nil {
		panic(err)
	}

	os.MkdirAll("page", 0755)
	os.WriteFile("page/index.html", []byte(html), 0644)
	fmt.Println("Saved page/index.html")

	for i, url := range resourceURLs {
		resp, err := http.Get(url)
		if err != nil {
			continue
		}
		data, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		ext := filepath.Ext(strings.Split(url, "?")[0])
		filename := fmt.Sprintf("page/asset-%d%s", i, ext)
		os.WriteFile(filename, data, 0644)
		fmt.Println("Saved", filename)
	}
}
