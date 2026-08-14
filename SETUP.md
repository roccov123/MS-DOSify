# Deployment Setup

## File structure
```
retro-spotify/
├── index.html          <- the app itself
├── api/
│   └── refresh-token.js <- runs server-side on Vercel
├── robots.txt
└── vercel.json
```

## 1. Push to GitHub
Create a repo, upload all files keeping this exact folder structure
(the `api` folder must stay named `api` — Vercel auto-detects anything
in there as a serverless function).

## 2. Import into Vercel
- vercel.com -> New Project -> import your repo -> Deploy.

## 3. Add your secrets as Environment Variables
This is the important part — do NOT put these in your code.

In Vercel: your project -> Settings -> Environment Variables -> add:

| Name                     | Value                          |
|---------------------------|--------------------------------|
| SPOTIFY_CLIENT_ID         | (your Client ID)               |
| SPOTIFY_CLIENT_SECRET     | (your Client Secret)           |
| SPOTIFY_REFRESH_TOKEN     | (the refresh token you got)    |

After adding them, redeploy (Vercel -> Deployments -> ... -> Redeploy)
so the function picks up the new variables.

## 4. Test it
Visit your deployed URL, click "Sync Library." If it works, you'll see
your saved tracks populate. Click a track, hit PLAY — should start
playing on the "Win 1.0 Virtual Soundcard" device (requires Premium).

## If Sync fails
Open DevTools Console (F12) for the browser-side error, and check
Vercel -> your project -> Deployments -> the latest one -> Functions ->
`/api/refresh-token` logs for the server-side error. Common causes:
- Env variables misspelled/missing -> redeploy after fixing.
- Refresh token was revoked (e.g. someone removed the app's access
  from Spotify account settings) -> you'd need a new one from the
  helper script.
