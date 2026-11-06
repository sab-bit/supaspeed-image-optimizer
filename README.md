# Little Lessons — Face-to-face study buddy

A responsive browser-based study companion built with React and Vite. Its split study room pairs a customizable tutor portrait with an optional front-camera mirror, alongside a simple story-style study chat.

## Run it

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`; `npm run preview` serves that build locally.

## Features

- Full-screen-inspired tutor and camera-mirror layout, adapted for iPad and smaller screens.
- Choose a portrait image from the device photo library. The tutor illustration/photo has gentle eye-blink and speaking-mouth animations.
- Camera is opt-in: tap **Turn on front camera** and allow browser permission. The mirror uses the front camera, mirrors the video, and can be turned off at any time. Camera access generally requires HTTPS or localhost.
- Topic chat produces a gentle, beginner-friendly story-style explanation with everyday analogies. This starter uses local templates, not a connected AI model; it does not send study notes to a server.
- Voice output uses the browser's speech synthesis by default. The optional settings dialog accepts an ElevenLabs API key and voice ID for natural speech.

## Voice key and privacy

The ElevenLabs key and voice ID are saved in this browser's local storage. With a key configured, the browser sends text directly to the ElevenLabs text-to-speech API. This client-only demo has no server-side secret storage; never enter a key on a shared device or in an app deployed for other users. For a public deployment, proxy ElevenLabs requests through a secure backend and authenticate users. Without an ElevenLabs key, the app falls back to the device/browser speech voice.

Photo data stays in memory in the current page; the app does not upload it. The camera only starts after the user taps the camera button, and its tracks are stopped when the camera is turned off or the page is left.
