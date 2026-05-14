# Spec 011: Supabase Auth — Core Infrastructure

## What This Feature Does

Adds user authentication via Supabase with email/password sign-up, email/password sign-in, magic link (email OTP), and logout. An auth gate ensures only authenticated users reach the app. Data remains local (AsyncStorage) — this spec adds identity only, not sync.

## Current State

- No authentication exists. All data is anonymous and device-local.
- `app/(tabs)/_layout.tsx:14` gates on `isOnboardingComplete` and redirects to `/onboarding` if false.
- `app/_layout.tsx` wraps providers: `UserProvider` > `HabitProvider` > `ChallengeProvider` > `ThemeProvider` > `Stack`.
- `app.json` already defines `"scheme": "saraevtutorialgolffitness"`.
- `expo-linking`, `expo-web-browser`, `@react-native-async-storage/async-storage` already installed.
- `.gitignore` has `.env*.local` but not `.env`.

## Changes Required

### 1. Package Installation

```bash
npx expo install @supabase/supabase-js expo-sqlite expo-secure-store expo-auth-session
npm install aes-js react-native-get-random-values
npm install --save-dev @types/aes-js
```

Packages already installed (no action): `@react-native-async-storage/async-storage`, `expo-linking`, `expo-web-browser`.

### 2. Environment Setup

Create `.env` at project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
```

Add `.env` to `.gitignore` (currently only `.env*.local` is ignored).

Create `.env.example` with placeholder values for documentation.

### 3. Supabase Client (`lib/supabase.ts` — new)

Copy the secure client (LargeSecureStore) exactly from the documentation. The file must contain:

- `import 'react-native-get-random-values'` (first import)
- `LargeSecureStore` class using AES-256 encryption via `aes-js`, storing encrypted data in AsyncStorage and the 256-bit encryption key in SecureStore
- `createClient()` with all three required auth options:
  - `autoRefreshToken: true`
  - `persistSession: true`
  - `detectSessionInUrl: false`
- Export `supabase` client instance

### 4. Auth Context (`contexts/auth-context.tsx` — new)

New provider that manages Supabase session state:

**State:**
- `session: Session | null`
- `isLoading: boolean` (true until initial session check completes)

**Initialization:**
- Call `supabase.auth.getSession()` on mount to check for existing session
- Subscribe to `supabase.auth.onAuthStateChange()` to track session changes
- Set `isLoading = false` after initial session resolves
- Clean up subscription on unmount

**Exposed via `useAuth()` hook:**
- `session` — current Supabase session (null if unauthenticated)
- `user` — derived from `session?.user ?? null`
- `isAuthenticated` — derived from `!!session`
- `isLoading` — true during initial session check

Auth action functions are NOT in the context — screens call `supabase.auth.*` directly. The context only manages session state.

### 5. Deep Link Handler

In `contexts/auth-context.tsx` (or a separate `utils/auth-linking.ts`):

- Call `WebBrowser.maybeCompleteAuthSession()` at module level (outside any component)
- Export `redirectTo` using `makeRedirectUri()` from `expo-auth-session`
- Export `createSessionFromUrl(url: string)` that:
  1. Extracts `access_token` and `refresh_token` from URL query params using `QueryParams.getQueryParams(url)` from `expo-auth-session/build/QueryParams`
  2. Calls `supabase.auth.setSession({ access_token, refresh_token })`
  3. Returns the session or throws on error

### 6. Auth Screen (`app/login.tsx` — new)

Full-screen route (no tab bar, no header) with three modes:

**Sign In mode (default):**
- Email text input
- Password text input (secureTextEntry)
- "Sign In" button → calls `supabase.auth.signInWithPassword({ email, password })`
- Error display below button
- Link: "Need an account? Sign Up" → switches to Sign Up mode
- Link: "Use magic link instead" → switches to Magic Link mode

**Sign Up mode:**
- Email text input
- Password text input (secureTextEntry)
- "Create Account" button → calls `supabase.auth.signUp({ email, password })`
- On success: show "Check your email to confirm your account" message
- Error display below button
- Link: "Already have an account? Sign In" → switches to Sign In mode

**Magic Link mode:**
- Email text input (no password field)
- "Send Magic Link" button → calls `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })`
- On success: show "Check your email for a sign-in link" message
- Error display below button
- Link: "Use password instead" → switches to Sign In mode

**Deep link handling in login screen:**
- Use `Linking.useURL()` to detect incoming deep links
- When URL arrives, call `createSessionFromUrl(url)` — the `onAuthStateChange` listener in AuthProvider will automatically update session state

**Visual design:**
- Match existing app aesthetic: golf-green palette, surface cards, 14px border radius
- App name/logo area at top
- Input fields with border, 14px radius, surface background
- Buttons use `colors.tint` background, white text, 14px radius, `fontWeight: '700'`
- Error text in `#E63946` below buttons

### 7. Navigation Gating (`app/_layout.tsx`)

**Add AuthProvider as outermost provider:**

```
AuthProvider > UserProvider > HabitProvider > ChallengeProvider > ThemeProvider > Stack
```

**Add `useProtectedRoute` hook** inside the layout (after all providers):

```typescript
function useProtectedRoute(session: Session | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inLogin = segments[0] === 'login';
    if (!session && !inLogin) {
      router.replace('/login');
    } else if (session && inLogin) {
      router.replace('/');
    }
  }, [session, segments]);
}
```

**Extract inner navigator component** that uses both `useAuth()` and `useProtectedRoute()`, renders the Stack. The root layout function itself only sets up providers.

**Add login route to Stack:**

```tsx
<Stack.Screen name="login" options={{ headerShown: false }} />
```

**Flow after these changes:**
1. App opens → AuthProvider checks session → `isLoading = true`
2. If no session → `useProtectedRoute` redirects to `/login`
3. User authenticates → `onAuthStateChange` fires → session set → redirect to `/`
4. Tab layout checks `isOnboardingComplete` → redirects to `/onboarding` if needed
5. After onboarding → tabs render normally

### 8. Logout in Settings (`app/settings.tsx`)

Add a new "Account" collapsible card section between "Preferences" and "Dev Tools":

- Section title: "Account"
- When expanded, shows the user's email (from `useAuth().user?.email`)
- "Sign Out" button (destructive style — red border, red text, `logout` icon)
- On press: call `supabase.auth.signOut()` — the `onAuthStateChange` listener will clear the session and `useProtectedRoute` will redirect to `/login`

Import `useAuth` from `@/contexts/auth-context` and `supabase` from `@/lib/supabase`.

### 9. Environment & Config

**`.gitignore`:** Add `.env` line (not just `.env*.local`).

**Supabase Dashboard configuration (manual steps for developer):**
1. Create a Supabase project (or use existing)
2. Go to Authentication > Providers > Email — ensure enabled
3. Go to Authentication > URL Configuration > Additional Redirect URLs — add `saraevtutorialgolffitness://**`
4. Copy project URL and publishable key into `.env`

## Key Implementation Details

- **No `@supabase/ssr`** — that package is for server-side frameworks. Use `@supabase/supabase-js` directly.
- **`detectSessionInUrl: false`** is mandatory — there is no browser URL bar in React Native.
- **LargeSecureStore** encrypts session tokens before storing in AsyncStorage. The encryption key lives in SecureStore (2048-byte limit handled by the wrapper).
- **`WebBrowser.maybeCompleteAuthSession()`** must be called at module level, not inside a component. This is needed for OAuth flows (Spec 012) but is harmless to include now.
- **Data stays local.** Signing out does not clear AsyncStorage habit/training data. A future sync spec will handle per-user data isolation. This is a known limitation: if user A signs out and user B signs in on the same device, user B sees user A's data.
- **`onAuthStateChange`** is the single source of truth for session state. The login screen does not need to manually update state after successful auth calls — the listener handles it.

## Acceptance Criteria

- [ ] Supabase client initializes with LargeSecureStore encryption and all three required auth options
- [ ] Auth screen renders with email/password sign-in, sign-up, and magic link modes
- [ ] Email/password sign-up calls `signUp()` and shows confirmation message
- [ ] Email/password sign-in calls `signInWithPassword()` and navigates to app on success
- [ ] Magic link calls `signInWithOtp()` with `emailRedirectTo` and shows confirmation message
- [ ] Deep link handler exchanges tokens via `createSessionFromUrl` when app receives magic link callback
- [ ] Unauthenticated users are redirected to `/login` from any route
- [ ] Authenticated users are redirected away from `/login` to `/`
- [ ] Existing onboarding gate still works: new users see onboarding after first sign-in
- [ ] Settings screen shows "Account" section with user email and "Sign Out" button
- [ ] Sign out clears session and redirects to `/login`
- [ ] Environment variables use `EXPO_PUBLIC_` prefix
- [ ] `.env` is in `.gitignore`

## Files to Touch

- `lib/supabase.ts` — new: Supabase client with LargeSecureStore
- `contexts/auth-context.tsx` — new: AuthProvider, useAuth hook, deep link utilities
- `app/login.tsx` — new: auth screen with 3 modes
- `app/_layout.tsx` — add AuthProvider wrapping, useProtectedRoute, login Stack.Screen
- `app/settings.tsx` — add Account section with email display and sign-out button
- `.env` — new: Supabase URL and publishable key
- `.env.example` — new: placeholder values
- `.gitignore` — add `.env`
- `package.json` — updated by install commands
