# Test Plan: Spec 012 — Native Social Auth (Google & Apple)

## Setup

- **Platform:** iOS Simulator/device for Apple tests; iOS or Android device for Google tests
- **Preconditions:**
  - Spec 011 fully implemented and working (email/password auth, AuthProvider, nav gating)
  - Supabase Google provider enabled with Web client ID and secret
  - Supabase Apple provider enabled with Service ID, Team ID, Key ID, private key
  - `.env` has `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` set to the Web client ID
  - `app.json` has both social auth plugins configured
  - App built with `npx expo prebuild` and run natively (NOT Expo Go — Google Sign-In requires native modules)
  - A Google account available for testing
  - An Apple ID available for testing (iOS)
  - Bundle ID registered with Apple and Google

**Important:** Social sign-in requires a development build, not Expo Go. Run `npx expo run:ios` or `npx expo run:android`.

## Tests

### Test 1: Google Sign-In button visibility
**Steps:**
1. Navigate to login screen
2. Look for the Google Sign-In button

**Expected:** Google Sign-In button is visible below the email form, separated by an "or" divider. Button matches app design (golf-green themed, not default Google button).

### Test 2: Google Sign-In success
**Steps:**
1. On login screen, tap the Google Sign-In button
2. Complete the native Google sign-in flow (select account, authorize)
3. Observe navigation after sign-in

**Expected:** Google account picker appears natively. After selecting an account, `signInWithIdToken` authenticates with Supabase. User is redirected to onboarding (new user) or tabs (returning user).

### Test 3: Google Sign-In cancellation
**Steps:**
1. Tap Google Sign-In button
2. Cancel/dismiss the Google account picker
3. Observe login screen

**Expected:** User returns to login screen. No error shown (or a dismissible "Sign in cancelled" message). No crash.

### Test 4: Google Sign-In error handling
**Steps:**
1. Temporarily set an invalid `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
2. Tap Google Sign-In
3. Observe error

**Expected:** Error message displayed on login screen. No crash. App remains functional.

### Test 5: Apple Sign-In button visibility — iOS
**Steps:**
1. On an iOS device/simulator, navigate to login screen
2. Look for the Apple Sign-In button

**Expected:** Apple Sign-In button appears below Google button. Uses native `AppleAuthenticationButton` styling (black/white depending on color scheme).

### Test 6: Apple Sign-In button visibility — Android
**Steps:**
1. On an Android device/emulator, navigate to login screen
2. Look for the Apple Sign-In button

**Expected:** Apple Sign-In button appears with custom styling (not native Apple button, since that's iOS-only). OR: Apple button is hidden on Android if the team decides not to support Apple OAuth on Android.

### Test 7: Apple Sign-In success — iOS (native)
**Steps:**
1. On iOS, tap Apple Sign-In button
2. Complete Face ID/Touch ID/password authentication
3. Choose "Share My Email" or "Hide My Email"
4. Observe navigation

**Expected:** Native Apple authentication sheet appears. After authenticating, `signInWithIdToken` with Apple token succeeds. User is redirected to onboarding or tabs.

### Test 8: Apple Sign-In — name capture on first sign-in
**Steps:**
1. Use a fresh Apple ID (or one that hasn't signed into this app before)
2. Complete Apple Sign-In on iOS
3. Check user metadata in Supabase Dashboard (Authentication > Users > select user)

**Expected:** User's `full_name`, `given_name`, and `family_name` are stored in `user_metadata` via the `updateUser()` call. This only works on the very first sign-in.

### Test 9: Apple Sign-In cancellation — iOS
**Steps:**
1. Tap Apple Sign-In on iOS
2. Cancel/dismiss the Apple authentication sheet
3. Observe login screen

**Expected:** User returns to login screen. No error shown. `ERR_REQUEST_CANCELED` handled silently.

### Test 10: Apple Sign-In — Android OAuth fallback
**Steps:**
1. On Android, tap Apple Sign-In button
2. Web browser opens with Apple's sign-in page
3. Complete sign-in in browser
4. Observe app reopening via deep link

**Expected:** `openAuthSessionAsync` opens Apple auth in browser. After sign-in, browser redirects back to app via `saraevtutorialgolffitness://` scheme. `createSessionFromUrl` exchanges tokens. User authenticated.

### Test 11: Social buttons appear in all login modes
**Steps:**
1. On login screen in Sign In mode — verify social buttons visible
2. Switch to Sign Up mode — verify social buttons still visible
3. Switch to Magic Link mode — verify social buttons still visible

**Expected:** Google and Apple (on iOS) buttons are always visible regardless of the email form mode.

### Test 12: Social login followed by sign out and re-sign-in
**Steps:**
1. Sign in with Google
2. Navigate to Settings > Account > Sign Out
3. Return to login screen
4. Sign in with Google again (same account)

**Expected:** Second sign-in works. Same user account in Supabase. Redirected to tabs (onboarding already done).

### Test 13: Mixed auth methods — same email
**Steps:**
1. Sign up with email/password using a Gmail address
2. Sign out
3. Sign in with Google using the same Gmail address
4. Observe behavior

**Expected:** Behavior depends on Supabase project settings (auto-linking vs separate identities). Default: accounts may be linked automatically. Verify no error occurs.

### Test 14: Dark mode social buttons
**Steps:**
1. Switch device to dark mode
2. Navigate to login screen
3. Verify social button styling

**Expected:** Google button adapts to dark theme. Apple button uses `WHITE` style (on iOS) in dark mode. All buttons are legible and properly themed.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
