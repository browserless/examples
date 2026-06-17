// Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
// using the Browserless /export endpoint.
// Uses encoding/json and net/http from the standard library — no extra packages needed.
//
// Run: go run main.go

package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	token := "YOUR_API_TOKEN_HERE"

	body := `{"url":"https://example.com","includeResources":true}`
	req, _ := http.NewRequest("POST",
		"https://production-sfo.browserless.io/export?token="+token,
		bytes.NewBufferString(body),
	)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)
	os.WriteFile("page.zip", data, 0644)
	fmt.Println("Saved page.zip")
}
