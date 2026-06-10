// Opens multiple independent chromedp browser sessions on Browserless in parallel.
// Each goroutine gets its own NewRemoteAllocator context — a separate browser session.
// Output lines may arrive out of order since sessions finish at different times.
//
// Install: go get github.com/chromedp/chromedp
// Run:     go run main.go

package main

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/chromedp/chromedp"
)

func main() {
	token := "YOUR_API_TOKEN_HERE"
	ws := fmt.Sprintf("wss://production-sfo.browserless.io?token=%s", token)
	urls := []string{
		"https://example.com/page/1",
		"https://example.com/page/2",
		"https://example.com/page/3",
		"https://example.com/page/4",
		"https://example.com/page/5",
	}

	var wg sync.WaitGroup

	for i, url := range urls {
		wg.Add(1)
		go func(i int, url string) {
			defer wg.Done()

			// Each goroutine gets its own allocator — a separate browser session per URL.
			allocCtx, cancel := chromedp.NewRemoteAllocator(
				context.Background(), ws, chromedp.NoModifyURL,
			)
			defer cancel()

			ctx, cancel := chromedp.NewContext(allocCtx)
			defer cancel()

			var title string
			if err := chromedp.Run(ctx,
				chromedp.Navigate(url),
				chromedp.Title(&title),
			); err != nil {
				log.Printf("[%d] error: %v", i+1, err)
				return
			}

			fmt.Printf("[%d] %s\n", i+1, title)
		}(i, url)
	}

	wg.Wait()
	fmt.Println("All done")
}
