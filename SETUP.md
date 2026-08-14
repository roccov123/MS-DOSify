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
| APP_PASSWORD              | (a password YOU make up)       |

`APP_PASSWORD` is what gates the Admin Login screen. Pick something
only you know — this is what actually protects your account, so don't
skip it.

After adding them, redeploy (Vercel -> Deployments -> ... -> Redeploy)
so the function picks up the new variables.

## 4. Configure the Spotify app's Redirect URI (needed for "Sign In With
   Your Spotify Account", not needed for Admin Login)

In the Spotify Developer Dashboard -> your app -> Settings -> Redirect
URIs, add the exact URL of your deployed site, e.g.:

    https://your-app-name.vercel.app/

It must match **exactly** what the browser sends — same scheme
(https), same host, same path, same trailing slash. If it doesn't
match character-for-character, Spotify returns
`redirect_uri: Not matching configuration` instead of logging the
guest in. If you also test on a Vercel preview URL, add that preview
URL too — Spotify checks against a literal list, not a pattern.

## 5. Test it
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
