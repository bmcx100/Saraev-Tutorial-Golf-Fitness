# Spec 014: Password Recovery Flow

## What This Feature Does

Users who forget their password can request a reset email from the login screen, then set a new password in-app after clicking the email link. The app detects the PASSWORD_RECOVERY auth event and routes to a dedicated reset screen instead of dropping into onboarding or the main app.

## Current State

**AuthProvider** (`contexts/auth-context.tsx`):
- `onAuthStateChange` listener receives the event type (including `PASSWORD_RECOVERY`) but ignores it — only calls `setSession(newSession)`.
- Exports `createSessionFromUrl()` for processing deep link tokens and `redirectTo` (from `makeRedirectUri()`).

**Route protection** (`app/_layout.tsx`):
- `useProtectedRoute` has two rules: no session + not on login → redirect to `/login`; session + on login → redirect to `/`.
- No awareness of recovery sessions.

**Login screen** (`app/login.tsx`):
- Three modes: sign-in, sign-up, magic-link. No "Forgot Password?" option.
- Already handles deep links via `Linking.useURL()` → `createSessionFromUrl()`.

**Supabase client** (`lib/supabase.ts`):
- `detectSessionInUrl: Platform.OS === 'web'` — on web, URL hash tokens from Supabase are auto-processed. On native, deep links go through `createSessionFromUrl()`.

## Changes Required

### 1. AuthProvider — expose `isPasswordRecovery` flag

Add `isPasswordRecovery` boolean to context value and state:

- In the `onAuthStateChange` callback, check if `event === 'PASSWORD_RECOVERY'`. If so, set `isPasswordRecovery` to `true`.
- Add `clearPasswordRecovery()` function that sets the flag to `false`.
- Export both in the context value and `useAuth()` return type.

Update `AuthContextValue`:
```ts
interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
}
```

### 2. Login screen — add "Forgot Password?" link and request flow

Add a `handleForgotPassword` function and UI link in sign-in mode:

- `handleForgotPassword` calls `supabase.auth.resetPasswordForEmail(email, { redirectTo })` where `redirectTo` is the existing `redirectTo` from `makeRedirectUri()`.
- Validates that email is non-empty before calling. Shows error if empty.
- On success, shows message: "Check your email for a password reset link".
- On error, shows the Supabase error message.

UI: Add a "Forgot Password?" pressable below the password input, above the submit button, right-aligned. Only visible in `sign-in` mode. Style: same `linkText` style as existing mode-switch links, but with `alignSelf: 'flex-end'`.

### 3. Route protection — redirect recovery sessions to /reset-password

Update `useProtectedRoute` in `app/_layout.tsx`:

- Accept `isPasswordRecovery` as a third parameter.
- Add a new rule: if `session` exists AND `isPasswordRecovery` is `true` AND current segment is NOT `reset-password`, redirect to `/reset-password`.
- This rule takes priority over the existing "session + on login → redirect to `/`" rule.
- Add `reset-password` to the dependency check so the redirect doesn't loop.

### 4. New screen — `app/reset-password.tsx`

Create a full-screen route matching the login screen's visual style (SafeAreaView, KeyboardAvoidingView, ScrollView, logo area, form card).

**Form fields:**
- New Password (`secureTextEntry`, `textContentType="newPassword"`)
- Confirm Password (`secureTextEntry`, `textContentType="newPassword"`)

**Validation (inline, on submit):**
- Password minimum 8 characters
- Passwords must match
- Show error text below button (same `errorText` style as login)

**Submit handler:**
- Calls `supabase.auth.updateUser({ password })`.
- On success: show success message ("Password updated successfully"), call `clearPasswordRecovery()`, then after a 1.5 second delay, `router.replace('/')`.
- On error: show the Supabase error message.
- Disable button while loading (show ActivityIndicator, same pattern as login).

**Layout:**
- Logo area: same golf ball icon + "Golf Fitness" title as login. Tagline: "Set your new password".
- Form card title: "Reset Password".
- Submit button text: "Update Password".
- No mode-switch links, no social auth, no divider.

**Prevent back navigation:** The screen should not have a back button or allow gesture-back, since the user must complete the reset. Use `headerShown: false` (already standard) and the route protection redirect handles re-entry.

### 5. Stack registration

Add the new screen to the Stack in `app/_layout.tsx`:
```tsx
<Stack.Screen name="reset-password" options={{ headerShown: false }} />
```

### 6. Native deep link handling

No changes needed to the deep link setup — `createSessionFromUrl()` in the login screen already processes tokens from deep links, and `onAuthStateChange` fires `PASSWORD_RECOVERY` regardless of how the session was created (web URL detection or manual `setSession()`). The AuthProvider's new `isPasswordRecovery` flag and the route protection redirect handle the rest.

## Key Implementation Details

- The `PASSWORD_RECOVERY` event fires once when the recovery session is established. The flag must persist in React state until explicitly cleared — it does not need AsyncStorage persistence since recovery is a single-session flow.
- On web, Supabase's `detectSessionInUrl: true` auto-processes the hash fragment. The `onAuthStateChange` listener fires with `PASSWORD_RECOVERY`, which triggers the flag.
- On native, the deep link arrives via `Linking.useURL()` → `createSessionFromUrl()` → `setSession()` → `onAuthStateChange` with `PASSWORD_RECOVERY`.
- The reset-password screen must call `supabase.auth.updateUser()` (not `resetPasswordForEmail()` — that's for sending the email, not setting the new password).
- `redirectTo` from `makeRedirectUri()` handles both web and native redirect URLs correctly.
- The login screen's "Forgot Password?" feature uses the same `loading`/`error`/`message` state as existing auth actions.

## Acceptance Criteria

- [ ] Sign-in mode on login screen shows "Forgot Password?" link
- [ ] Tapping "Forgot Password?" with a valid email sends a reset email and shows confirmation message
- [ ] Tapping "Forgot Password?" with empty email shows an error
- [ ] After clicking the email reset link, the app routes to `/reset-password` (not `/` or `/onboarding`)
- [ ] Reset password screen shows new password and confirm password fields
- [ ] Submitting mismatched passwords shows validation error
- [ ] Submitting password shorter than 8 characters shows validation error
- [ ] Submitting a valid new password updates it via Supabase and redirects to `/`
- [ ] After successful reset, navigating back does not return to reset-password screen
- [ ] Recovery flow works on web (URL hash detection) and native (deep link)

## Files to Touch

- `contexts/auth-context.tsx` — add `isPasswordRecovery` state, `clearPasswordRecovery()`, update `onAuthStateChange` handler
- `app/_layout.tsx` — update `useProtectedRoute` to check `isPasswordRecovery`, add `reset-password` Stack.Screen
- `app/login.tsx` — add "Forgot Password?" link and `handleForgotPassword` function
- `app/reset-password.tsx` — new file, password reset form screen
