# Mobile App Packaging

The current project can be packaged as a mobile app, but model keys must remain on a server.

## Recommended Path

1. Ship the web app first.
2. Add PWA metadata and install prompts.
3. Deploy the Next.js server routes on Vercel or another server.
4. Wrap the deployed app with Capacitor for Android/iOS.

The mobile shell should call the deployed web/API backend. Do not embed `.env` secrets into a mobile bundle.

## Why Not Fully Offline?

The app includes server-side routes for:

- AI chat
- random exploration generation
- official astronomy API adapters
- settings/key status

These flows need server-side secrets and external network access. A fully offline app would need a different architecture and would rely only on local fallback content.

## Voice Notes

Browser speech synthesis varies by device. For a polished packaged app, consider:

- native iOS/Android TTS through a Capacitor plugin
- cloud TTS that generates audio server-side
- downloadable voice assets for fixed educational narration

## Store Readiness

Before submitting to app stores, prepare:

- privacy policy
- child safety and data handling explanation
- parent/teacher contact path
- clear statement that local wishes and memory are stored on device
- review of any analytics or cloud sync added later

