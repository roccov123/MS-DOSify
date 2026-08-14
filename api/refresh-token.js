// /api/refresh-token.js
//
// This runs server-side on Vercel, never in the browser.
// It reads your Client ID, Client Secret, and Refresh Token from
// environment variables (set in the Vercel dashboard, never in code)
// and exchanges the refresh token for a short-lived access token.
//
// The front end calls this endpoint and only ever receives back the
// access token — the secret and refresh token never leave the server.

export default async function handler(req, res) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.status(500).json({
      error: "Missing environment variables. Check Vercel project settings.",
    });
  }

  try {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    // Only return what the browser actually needs.
    // Spotify may or may not rotate the refresh token on each call;
    // if it sends a new one, log it server-side so you're aware,
    // but we still don't expose it to the browser.
    if (data.refresh_token) {
      console.log("Spotify issued a new refresh token. Consider updating your env var.");
    }

    return res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    return res.status(500).json({ error: "Token refresh failed." });
  }
}
