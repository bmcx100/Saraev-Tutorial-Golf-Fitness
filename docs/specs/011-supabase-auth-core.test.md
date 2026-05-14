# Test Plan: Spec 011 — Supabase Auth Core Infrastructure

## Setup

- **Platform:** iOS Simulator or physical device (deep linking requires native build, not Expo Go for full testing)
- **Preconditions:**
  - Supabase project created with Email provider enabled
  - `saraevtutorialgolffitness://**` added to Supabase redirect URLs
  - `.env` populated with valid Supabase URL and publishable key
  - App built and running via `npx expo start`
  - A test email account available (or email confirmation disabled in Supabase dashboard for dev)

## Tests

### Test 1: Unauthenticated redirect to login
**Steps:**
1. Clear app data / fresh install
2. Launch the app
3. Observe which screen appears

**Expected:** Login screen renders. User does NOT see tabs or onboarding.

### Test 2: Sign-up with email/password
**Steps:**
1. On login screen, tap "Need an account? Sign Up"
2. Verify mode switches to Sign Up (button says "Create Account")
3. Enter a valid email and password (min 6 chars)
4. Tap "Create Account"
5. Verify confirmation message appears ("Check your email to confirm your account")

**Expected:** `signUp` succeeds, confirmation message shown. If email confirmation is disabled in dashboard, user is immediately authenticated and redirected to onboarding.

### Test 3: Sign-in with email/password
**Steps:**
1. On login screen, ensure Sign In mode is active
2. Enter the email and password from Test 2 (after confirming email if required)
3. Tap "Sign In"
4. Observe navigation

**Expected:** User is authenticated. If `onboardingComplete` is false, redirected to onboarding. If true, redirected to tabs.

### Test 4: Sign-in error handling
**Steps:**
1. On login screen in Sign In mode
2. Enter an invalid email/password combination
3. Tap "Sign In"
4. Verify error message appears below the button

**Expected:** Error message displayed in red (e.g., "Invalid login credentials"). User stays on login screen.

### Test 5: Sign-up validation
**Steps:**
1. Switch to Sign Up mode
2. Try submitting with empty email
3. Try submitting with a password shorter than 6 characters
4. Try submitting with an already-registered email

**Expected:** Appropriate error messages for each case. No crash.

### Test 6: Magic link send
**Steps:**
1. On login screen, tap "Use magic link instead"
2. Verify mode switches (no password field visible, button says "Send Magic Link")
3. Enter a valid email address
4. Tap "Send Magic Link"
5. Verify confirmation message appears ("Check your email for a sign-in link")

**Expected:** OTP email sent. Confirmation message displayed. No navigation occurs yet.

### Test 7: Magic link deep link callback
**Steps:**
1. Complete Test 6 (magic link sent)
2. Open the magic link email on the test device
3. Tap the link in the email
4. Observe the app reopening and navigation

**Expected:** App receives deep link, `createSessionFromUrl` exchanges tokens, `onAuthStateChange` fires, user is authenticated, redirected to onboarding (or tabs if already onboarded).

### Test 8: Session persistence across app restarts
**Steps:**
1. Sign in successfully (email/password or magic link)
2. Force-close the app completely
3. Reopen the app

**Expected:** User is still authenticated. No login screen shown. Taken directly to tabs (or onboarding if not completed).

### Test 9: Auth → Onboarding → Tabs flow
**Steps:**
1. Start with a fresh user (no prior onboarding)
2. Sign in successfully
3. Verify onboarding screen appears
4. Complete onboarding (select habits, optionally select challenge)
5. Verify tabs screen appears

**Expected:** Full flow works: login → onboarding → tabs. Each gate works independently.

### Test 10: Settings — Account section
**Steps:**
1. Sign in and navigate to Settings
2. Find the "Account" collapsible section
3. Tap to expand it
4. Verify user's email is displayed
5. Verify "Sign Out" button is visible

**Expected:** Account section shows between Preferences and Dev Tools. Email matches the signed-in user. Sign Out button is styled in destructive red.

### Test 11: Sign out
**Steps:**
1. From Settings, expand Account section
2. Tap "Sign Out"
3. Observe navigation

**Expected:** Session cleared. User redirected to login screen. Tapping back does NOT return to Settings.

### Test 12: Sign out then sign in again
**Steps:**
1. Complete Test 11 (sign out)
2. Sign in again with the same credentials
3. Verify user returns to tabs (onboarding already completed)

**Expected:** User goes directly to tabs since `onboardingComplete` is still true in local storage.

### Test 13: Authenticated user cannot access login
**Steps:**
1. While signed in, attempt to navigate to `/login` programmatically (or via deep link)
2. Observe navigation

**Expected:** User is redirected back to `/` (tabs). The `useProtectedRoute` hook prevents authenticated users from seeing the login screen.

### Test 14: Mode switching on login screen
**Steps:**
1. Start on login screen (Sign In mode)
2. Tap "Need an account? Sign Up" — verify Sign Up mode
3. Tap "Already have an account? Sign In" — verify Sign In mode
4. Tap "Use magic link instead" — verify Magic Link mode
5. Tap "Use password instead" — verify Sign In mode

**Expected:** All mode switches work. Fields update appropriately (password field hidden in magic link mode, shown in others).

### Test 15: Supabase client encryption verification
**Steps:**
1. Sign in successfully
2. Inspect AsyncStorage (via dev tools or React Native debugger)
3. Look for Supabase session key

**Expected:** The session data in AsyncStorage is encrypted (hex string, not readable JSON). The encryption key is stored in SecureStore (not directly inspectable on device).

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
