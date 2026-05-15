# Spec 012: Native Social Auth — Google & Apple Sign-In

## What This Feature Does

Adds native Google Sign-In and native Apple Sign-In to the login screen from Spec 011. Google uses `signInWithIdToken` on all platforms. Apple uses native `signInWithIdToken` on iOS and falls back to OAuth web flow on Android. This completes the auth story started in Spec 011.

## Current State

After Spec 011:
- `lib/supabase.ts` exists with LargeSecureStore client
- `contexts/auth-context.tsx` exists with AuthProvider, session management, deep link handler (`createSessionFromUrl`, `redirectTo`)
- `app/login.tsx` exists with email/password and magic link modes
- `app/_layout.tsx` has AuthProvider wrapping all providers, `useProtectedRoute` for auth gating
- Deep linking configured: scheme `saraevtutorialgolffitness`, `WebBrowser.maybeCompleteAuthSession()` called at module level
- Packages installed: `@supabase/supabase-js`, `expo-auth-session`, `expo-web-browser`, `expo-linking`

## Changes Required

### 1. Package Installation

```bash
npx expo install expo-apple-authentication @react-native-google-signin/google-signin
```

### 2. App Config (`app.json`)

Add plugins for both social providers:

```json
{
  "plugins": [
    "expo-router",
    ["expo-splash-screen", { ... }],
    "expo-apple-authentication",
    [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
      }
    ]
  ]
}
```

**Note:** The `iosUrlScheme` is the reversed iOS client ID from Google Cloud Console. This is required for the Google Sign-In SDK on iOS.

### 3. Environment Variables

Add to `.env`:

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

Update `.env.example` to include the new variable.

**Critical:** This must be the **Web** OAuth client ID from Google Cloud Console — NOT the iOS or Android client ID. The `signInWithIdToken` flow requires the Web client ID.

### 4. Google Sign-In Component (`components/google-auth.tsx` — new)

Dedicated component following the documentation pattern:

- Import `GoogleSignin`, `isSuccessResponse` from `@react-native-google-signin/google-signin`
- Call `GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID })` at module level
- Export a component that renders a styled button (matching app design, not the default `GoogleSigninButton`)
- On press:
  1. `await GoogleSignin.hasPlayServices()`
  2. `const response = await GoogleSignin.signIn()`
  3. If `isSuccessResponse(response)`: call `supabase.auth.signInWithIdToken({ provider: 'google', token: response.data.idToken })`
- Handle errors: show error message via callback prop
- Do NOT use `signInWithOAuth` — use `signInWithIdToken`

### 5. Apple Sign-In Component (`components/apple-auth.tsx` — new)

Dedicated component with platform-conditional rendering:

**iOS (native `signInWithIdToken`):**
- Import `* as AppleAuthentication` from `expo-apple-authentication`
- Return `null` if `Platform.OS !== 'ios'`
- Render `AppleAuthentication.AppleAuthenticationButton` with:
  - `buttonType`: `SIGN_IN`
  - `buttonStyle`: `BLACK` (or `WHITE` based on color scheme)
  - Styled to match app button dimensions
- On press:
  1. Call `AppleAuthentication.signInAsync()` requesting `FULL_NAME` and `EMAIL` scopes
  2. If `credential.identityToken` exists: call `supabase.auth.signInWithIdToken({ provider: 'apple', token: credential.identityToken })`
  3. **Immediately after successful sign-in**, capture the user's full name with `supabase.auth.updateUser()` — Apple only provides the name on the VERY FIRST sign-in, it's gone forever if not captured
  4. Handle `ERR_REQUEST_CANCELED` as normal cancellation (not an error)
  5. Handle missing `identityToken` as an error

**Android (OAuth web flow fallback):**
- Render a custom-styled "Sign in with Apple" button (Apple's native button component is iOS-only)
- On press: call the OAuth web flow:
  1. `supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo, skipBrowserRedirect: true } })`
  2. `WebBrowser.openAuthSessionAsync(data.url, redirectTo)`
  3. If `res.type === 'success'`: call `createSessionFromUrl(res.url)`
- Import `redirectTo` and `createSessionFromUrl` from auth context/utils (established in Spec 011)

### 6. Login Screen Update (`app/login.tsx`)

Add social login buttons below the email form:

- Horizontal divider with "or" text between email form and social buttons
- `<GoogleAuth />` component — always rendered
- `<AppleAuth />` component — renders on iOS only (component handles platform check internally)
- Social buttons appear in all three modes (Sign In, Sign Up, Magic Link)
- Pass an `onError` callback to social components to display errors in the login screen's error state

### 7. Supabase Dashboard Configuration (manual)

**Google provider:**
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client IDs: one Web, one iOS, one Android
3. In Supabase Dashboard > Authentication > Providers > Google:
   - Enable Google provider
   - Add the Web client ID and client secret
4. Add the Web client ID to `.env` as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
5. Add the reversed iOS client ID as `iosUrlScheme` in `app.json` plugin config

**Apple provider:**
1. In Apple Developer > Certificates, Identifiers & Profiles:
   - Enable "Sign In with Apple" capability for the app's App ID
   - Create a Services ID for web/Android OAuth flow
   - Create a Key with Sign In with Apple enabled
2. In Supabase Dashboard > Authentication > Providers > Apple:
   - Enable Apple provider
   - Add the Service ID, Team ID, Key ID, and private key (for Android OAuth flow)
   - Add bundle IDs to Client IDs: `com.yourapp`, `host.exp.Exponent` (for Expo Go testing)
3. The iOS native flow does NOT require the secret key — only the Android OAuth fallback does

## Key Implementation Details

- **`signInWithIdToken` for both Google and Apple on iOS.** Do NOT use `signInWithOAuth` for these — the native SDK provides a better UX and avoids web browser redirects.
- **Google Web Client ID** is used for `signInWithIdToken` — not the iOS or Android client ID. This is a common mistake.
- **Apple name capture is one-shot.** Apple provides `fullName` only on the user's very first sign-in. The component must call `supabase.auth.updateUser()` with the name data immediately after `signInWithIdToken` succeeds. If this is skipped, the name is permanently lost.
- **`ERR_REQUEST_CANCELED`** from Apple Sign-In means the user tapped Cancel. Handle silently — do not show an error.
- **Apple Sign-In button style** should adapt to color scheme: `BLACK` style in light mode, `WHITE` style in dark mode.
- **Android Apple fallback** uses the same OAuth pattern as any web-based provider: `signInWithOAuth` + `openAuthSessionAsync` + `createSessionFromUrl`. This reuses deep linking infrastructure from Spec 011.
- **Conditionally render Apple button only on iOS** for the native button. On Android, render a custom-styled button that triggers the OAuth flow.
- **Apple OAuth secret rotation:** The Android fallback requires an Apple private key configured in Supabase. This key must be regenerated every 6 months. The native iOS flow does NOT have this requirement.

## Acceptance Criteria

- [ ] Google Sign-In button appears on login screen on all platforms
- [ ] Tapping Google Sign-In triggers native Google sign-in flow
- [ ] Google `signInWithIdToken` authenticates the user and redirects to app
- [ ] Google Sign-In uses the Web client ID (not iOS/Android client ID)
- [ ] Apple Sign-In button appears on login screen on iOS only
- [ ] Tapping Apple Sign-In on iOS triggers native Apple authentication
- [ ] Apple `signInWithIdToken` authenticates the user on iOS
- [ ] Apple user's full name is captured via `updateUser()` on first sign-in
- [ ] `ERR_REQUEST_CANCELED` from Apple Sign-In is handled silently
- [ ] On Android, Apple Sign-In falls back to OAuth web flow with deep link callback
- [ ] Social login errors display on the login screen
- [ ] Social login buttons appear alongside email/password and magic link options
- [ ] `app.json` includes plugins for `expo-apple-authentication` and `@react-native-google-signin/google-signin`

## Files to Touch

- `components/google-auth.tsx` — new: Google Sign-In component
- `components/apple-auth.tsx` — new: Apple Sign-In component with iOS native + Android OAuth fallback
- `app/login.tsx` — add social login buttons, divider, error callback wiring
- `app.json` — add `expo-apple-authentication` and `@react-native-google-signin/google-signin` plugins
- `.env` — add `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `.env.example` — add placeholder for Google Web client ID
- `package.json` — updated by install commands
