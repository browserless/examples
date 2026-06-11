// Two approaches for accessing Cloudflare Access-protected pages via the REST API:
//   1. Saved profile — reuse a browser session captured after logging in through CF Access.
//   2. Service Token — inject CF-Access headers via setExtraHTTPHeaders for machine-to-machine access.
//
// Uses encoding/json and net/http from the standard library — no extra packages needed.
//
// Run: go run main.go

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	token := "YOUR_API_TOKEN_HERE"
	client := http.DefaultClient

	// Approach 1: reuse a saved authenticated profile.
	profileReq, _ := http.NewRequest("POST",
		"https://production-sfo.browserless.io/screenshot?token="+token+"&profile=cf-access-profile",
		bytes.NewBufferString(`{"url":"https://internal.example.com/dashboard"}`),
	)
	profileReq.Header.Set("Content-Type", "application/json")
	profileRes, err := client.Do(profileReq)
	if err != nil {
		panic(err)
	}
	defer profileRes.Body.Close()
	data, _ := io.ReadAll(profileRes.Body)
	os.WriteFile("dashboard.png", data, 0644)
	fmt.Println("Saved dashboard.png")

	// Approach 2: inject Service Token headers via setExtraHTTPHeaders.
	tokenPayload, _ := json.Marshal(map[string]interface{}{
		"url": "https://internal.example.com/dashboard",
		"setExtraHTTPHeaders": map[string]string{
			"CF-Access-Client-Id":     "YOUR_CF_CLIENT_ID.access",
			"CF-Access-Client-Secret": "YOUR_CF_CLIENT_SECRET",
		},
	})
	tokenReq, _ := http.NewRequest("POST",
		"https://production-sfo.browserless.io/content?token="+token,
		bytes.NewBuffer(tokenPayload),
	)
	tokenReq.Header.Set("Content-Type", "application/json")
	tokenRes, err := client.Do(tokenReq)
	if err != nil {
		panic(err)
	}
	defer tokenRes.Body.Close()
	content, _ := io.ReadAll(tokenRes.Body)
	end := len(content)
	if end > 200 {
		end = 200
	}
	fmt.Println(string(content[:end]))
}
