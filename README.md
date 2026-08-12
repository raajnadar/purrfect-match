# Purrfect Match

A behavior assessment and gift curation app for cat owners. Swipe through cat
behavior traits, then get gift recommendations that match the answers.

The app is a proof of concept. It exists to stress-test the
[RootNative UI](https://rootnative.github.io/ui/) component, theme, and
animation packages on web, Android, and iOS.

## Try it

### Web

**[raajnadar.github.io/purrfect-match](https://raajnadar.github.io/purrfect-match/)**

The site runs on GitHub Pages. A push to `main` starts a new deploy.

### Android and iOS

Install [Expo Go](https://expo.dev/go), then scan this QR code with the camera:

<img src="assets/expo-go-qr.png" alt="Expo Go QR code for the preview channel" width="220">

If the camera does not open the app, type this link into Expo Go:

```
exp://u.expo.dev/8addb12e-f2ac-4e76-9f0f-4f83f16d8768?runtime-version=exposdk%3A54.0.0&channel-name=preview
```

The QR code points at the `preview` channel on
[expo.dev](https://expo.dev/accounts/raajnadar/projects/purrfect-match). The QR
code stays correct after each publish, because the channel always serves the
newest update.

You need Expo Go for SDK 54. The update declares the runtime version
`exposdk:54.0.0`, and Expo Go loads an update only when the runtime version is
an exact match.

## What the app shows

| Phase | Feature | Library focus |
| --- | --- | --- |
| 1 | The behavior deck. Swipe right for yes and left for no. | Continuous gesture tracking, interpolation, spring reset |
| 2 | The gift reveal. A bottom sheet lists the recommendations. | Drag gestures, staggered entrance animation |
| 3 | The detail view. A gift opens to a full screen. | Shared element transition, dynamic theme |

Every screen has a pointer path and a keyboard path. The deck has "Yes" and
"No" buttons next to the swipe gesture.

## Tech stack

- [Expo](https://expo.dev/) SDK 54 with [Expo Router](https://docs.expo.dev/router/introduction/)
- `@rootnative/components` — UI components with Material Design 3 tokens
- `@rootnative/core` — the theme system
- `@rootnative/inertia` and `@rootnative/inertia-gestures` — animation and gestures
- `react-native-svg` — the paw-print background
- Cat images come from [TheCatAPI](https://thecatapi.com/). The traits and the
  gifts come from local JSON data.

## Run it locally

```bash
yarn install
yarn start
```

Press `w` for web, `a` for Android, or `i` for iOS.

## Deploy

### Web to GitHub Pages

The workflow [.github/workflows/deploy-web.yml](.github/workflows/deploy-web.yml)
does the deploy. It runs on every push to `main`, and you can also start it by
hand from the Actions tab.

The workflow does these steps:

1. It exports the static web bundle with `expo export --platform web`.
2. It sets `EXPO_BASE_URL` to `/purrfect-match`, because GitHub Pages serves the
   site from a sub-path. [app.config.js](app.config.js) reads that variable and
   writes it to `experiments.baseUrl`.
3. It adds `.nojekyll`, because Jekyll hides the `_expo` folder.
4. It copies `+not-found.html` to `404.html` for the unknown paths.

To build the same output on your machine, run:

```bash
yarn export:web
```

The files go to `dist/`.

### Mobile to expo.dev

A publish sends new JavaScript and new assets to the `preview` channel. Expo Go
gets the update the next time it opens the link.

```bash
yarn update:preview
```

The command asks for a message, then publishes. A native build is not
necessary, because Expo Go supplies the native runtime.

`app.json` sets the runtime version policy to `sdkVersion`. That policy keeps
the update compatible with Expo Go. Change the policy to `appVersion` or
`fingerprint` before you make a standalone build with EAS Build.

## Project structure

```
app/                    # The screens. Expo Router maps the files to routes.
├── _layout.tsx         # The root layout, the theme, and the fonts
├── index.tsx           # The behavior deck
└── theme-preview.tsx   # A reference screen for the theme tokens
components/             # The card, the skeleton, and the decoration components
theme/                  # The Material Design 3 theme and the custom tokens
data/                   # The traits and the gift data
hooks/                  # The cat image loader
app.json                # The static Expo config
app.config.js           # Adds the GitHub Pages base URL at build time
CLAUDE.md               # The brief and the docs for AI agents
DX-NOTES.md             # The friction log for the @rootnative/* packages
```

## Checks

Run these three commands before you push a change:

```bash
yarn typecheck
npx expo export --platform web
npx expo export --platform ios
```

Also check the layout at a narrow width and at a wide width. The deck must not
stretch across a desktop browser.

## Learn more

- [RootNative docs](https://rootnative.github.io/ui)
- [Component API reference](https://rootnative.github.io/ui/llms-full.txt)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
