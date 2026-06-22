// Creates a Browserless session and closes it via the Session API.
//
// Run: node close-session.mjs

const TOKEN = "YOUR_API_TOKEN_HERE";

const sessionResponse = await fetch(
  `https://production-sfo.browserless.io/session?token=${TOKEN}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ttl: 60000, stealth: true }),
  }
);
const session = await sessionResponse.json();
console.log("Session created:", session.id);

const closeResponse = await fetch(`${session.stop}&force=true`, {
  method: "DELETE",
});
console.log("Session closed:", closeResponse.status === 200 ? "success" : "failed");
