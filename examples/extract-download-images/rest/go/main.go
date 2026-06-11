// Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
// then downloads each image to an images/ directory.
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
	"path/filepath"
	"strings"
)

type ScrapeResponse struct {
	Data []struct {
		Results []struct {
			Attributes []struct {
				Name  string `json:"name"`
				Value string `json:"value"`
			} `json:"attributes"`
		} `json:"results"`
	} `json:"data"`
}

func main() {
	token := "YOUR_API_TOKEN_HERE"

	body := `{"url":"https://example.com","elements":[{"selector":"img","timeout":5000}]}`
	req, _ := http.NewRequest("POST",
		"https://production-sfo.browserless.io/scrape?token="+token,
		bytes.NewBufferString(body),
	)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var scrape ScrapeResponse
	json.NewDecoder(resp.Body).Decode(&scrape)

	os.MkdirAll("images", 0755)
	i := 0

	for _, result := range scrape.Data[0].Results {
		for _, attr := range result.Attributes {
			if attr.Name == "src" && strings.HasPrefix(attr.Value, "http") {
				imgResp, err := http.Get(attr.Value)
				if err != nil {
					continue
				}
				data, _ := io.ReadAll(imgResp.Body)
				imgResp.Body.Close()

				// Strip query strings before extracting the extension.
				ext := filepath.Ext(strings.Split(attr.Value, "?")[0])
				if ext == "" {
					ext = ".jpg"
				}
				filename := fmt.Sprintf("images/image-%d%s", i, ext)
				os.WriteFile(filename, data, 0644)
				fmt.Println("Saved", filename)
				i++
			}
		}
	}
}
