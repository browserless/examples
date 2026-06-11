// Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
// proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
// harder to bypass from datacenter IPs.
//
// Uses encoding/json and net/http from the standard library — no extra packages needed.
// Run: go run main.go

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type UnblockResponse struct {
	Content string `json:"content"`
}

func main() {
	token := "YOUR_API_TOKEN_HERE"

	body := `{"url":"https://example-cloudflare-protected.com","content":true,"cookies":false,"screenshot":false,"browserWSEndpoint":false}`
	req, _ := http.NewRequest("POST",
		"https://production-sfo.browserless.io/unblock?token="+token+"&proxy=residential",
		bytes.NewBufferString(body),
	)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)
	var result UnblockResponse
	json.Unmarshal(data, &result)

	end := len(result.Content)
	if end > 500 {
		end = 500
	}
	fmt.Println(result.Content[:end])
}
