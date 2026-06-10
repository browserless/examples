// Extracts all <img> src URLs from the fully rendered DOM, then downloads each
// image to an images/ directory. Useful when images are lazy-loaded or injected
// by JavaScript after initial page load.
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

	var imageUrls []string
	if err := chromedp.Run(ctx,
		chromedp.Navigate("https://example.com"),
		chromedp.WaitReady("img"),
		// img.src returns fully-resolved absolute URLs, so no relative URL handling needed.
		chromedp.Evaluate(`
			Array.from(document.querySelectorAll('img'))
			  .map(img => img.src)
			  .filter(src => src.startsWith('http'))
		`, &imageUrls),
	); err != nil {
		panic(err)
	}

	fmt.Printf("Found %d images\n", len(imageUrls))
	os.MkdirAll("images", 0755)

	for i, url := range imageUrls {
		resp, err := http.Get(url)
		if err != nil {
			continue
		}
		data, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		// Strip query strings before extracting the extension.
		ext := filepath.Ext(strings.Split(url, "?")[0])
		if ext == "" {
			ext = ".jpg"
		}
		filename := fmt.Sprintf("images/image-%d%s", i, ext)
		os.WriteFile(filename, data, 0644)
		fmt.Println("Saved", filename)
	}
}
