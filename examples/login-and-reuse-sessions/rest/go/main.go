// Logs in once and reuses that authenticated state across future sessions.
// Phase 1 creates a named profile session (use a CDP client to log in and save).
// Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
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
	const token = "YOUR_API_TOKEN_HERE"
	const origin = "https://production-sfo.browserless.io"

	client := &http.Client{}

	// Phase 1 – create a named profile session.
	sessionBody := bytes.NewBufferString(`{"name": "my-profile"}`)
	sessionReq, _ := http.NewRequest("POST",
		origin+"/profile?token="+token,
		sessionBody,
	)
	sessionReq.Header.Set("Content-Type", "application/json")
	sessionResp, _ := client.Do(sessionReq)
	defer sessionResp.Body.Close()
	var session map[string]string
	json.NewDecoder(sessionResp.Body).Decode(&session)
	fmt.Println("Connect URL:", session["connect"])
	// Use session["connect"] with a CDP client (Puppeteer or Playwright) to log in
	// and call Browserless.saveProfile to persist the session.

	// Phase 2 – reuse the saved profile.
	screenshotBody := bytes.NewBufferString(`{"url": "https://app.example.com/dashboard"}`)
	screenshotReq, _ := http.NewRequest("POST",
		origin+"/screenshot?token="+token+"&profile=my-profile",
		screenshotBody,
	)
	screenshotReq.Header.Set("Content-Type", "application/json")
	screenshotResp, _ := client.Do(screenshotReq)
	defer screenshotResp.Body.Close()
	data, _ := io.ReadAll(screenshotResp.Body)
	os.WriteFile("dashboard.png", data, 0644)
	fmt.Println("Screenshot saved to dashboard.png.")
}
