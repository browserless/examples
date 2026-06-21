# Creates a Browserless session and closes it via the Session API.
#
# Install: pip install requests
# Run:     python close_session.py

import requests

TOKEN = "YOUR_API_TOKEN_HERE"

session_response = requests.post(
    f"https://production-sfo.browserless.io/session?token={TOKEN}",
    json={"ttl": 60000, "stealth": True},
)
session = session_response.json()
print("Session created:", session["id"])

close_response = requests.delete(f"{session['stop']}&force=true")
print("Session closed:", "success" if close_response.ok else "failed")
