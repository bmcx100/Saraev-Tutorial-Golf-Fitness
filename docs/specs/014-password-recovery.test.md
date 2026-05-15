# Test Plan: Spec 014 — Password Recovery Flow

## Setup
- Starting URL: http://localhost:8081 (Expo web)
- Preconditions: A test account exists with email/password auth in Supabase
- Supabase project must have email templates configured (password recovery type)

## Tests

### Test 1: Forgot Password link visible in sign-in mode only
**Steps:**
1. Navigate to /login
2. Verify "Forgot Password?" link is visible
3. Tap "Need an account? Sign Up" to switch to sign-up mode
4. Verify "Forgot Password?" link is NOT visible
5. Tap "Already have an account? Sign In" to return
6. Verify "Forgot Password?" link is visible again
7. Tap "Use magic link instead" to switch to magic-link mode
8. Verify "Forgot Password?" link is NOT visible

**Expected:** "Forgot Password?" link only appears in sign-in mode

### Test 2: Forgot Password with empty email shows error
**Steps:**
1. Navigate to /login
2. Leave email field empty
3. Tap "Forgot Password?"
4. Verify error message appears (e.g., "Enter your email to reset password" or similar)

**Expected:** Inline error displayed, no network request made

### Test 3: Forgot Password with valid email shows success message
**Steps:**
1. Navigate to /login
2. Enter a valid email address in the email field
3. Tap "Forgot Password?"
4. Verify loading state appears briefly
5. Verify success message appears: "Check your email for a password reset link"

**Expected:** Success message shown, no navigation occurs, user stays on login screen

### Test 4: Reset password screen layout matches login styling
**Steps:**
1. Navigate directly to /reset-password (with a recovery session active)
2. Verify golf ball logo icon is present
3. Verify "Golf Fitness" title is present
4. Verify form card with "Reset Password" title
5. Verify "New Password" input field exists
6. Verify "Confirm Password" input field exists
7. Verify "Update Password" button exists
8. Verify no social login buttons, no mode-switch links

**Expected:** Screen matches login visual style with only password reset form elements

### Test 5: Reset password — mismatched passwords
**Steps:**
1. Navigate to /reset-password (with recovery session)
2. Enter "NewPass123" in new password field
3. Enter "DifferentPass" in confirm password field
4. Tap "Update Password"
5. Verify error message about passwords not matching

**Expected:** Validation error shown, no API call made

### Test 6: Reset password — password too short
**Steps:**
1. Navigate to /reset-password (with recovery session)
2. Enter "abc" in new password field
3. Enter "abc" in confirm password field
4. Tap "Update Password"
5. Verify error message about minimum length (8 characters)

**Expected:** Validation error shown, no API call made

### Test 7: Reset password — successful password update
**Steps:**
1. Navigate to /reset-password (with recovery session)
2. Enter a valid password (8+ characters) in both fields
3. Tap "Update Password"
4. Verify loading indicator appears on button
5. Verify success message: "Password updated successfully"
6. Wait for redirect (~1.5 seconds)
7. Verify app navigates to / (main app)

**Expected:** Password updated, success message shown, redirected to main app

### Test 8: Recovery session routes to reset-password, not main app
**Steps:**
1. Start with no session (logged out, on /login)
2. Simulate a PASSWORD_RECOVERY auth event (click recovery link / process recovery URL)
3. Verify the app navigates to /reset-password (not / or /onboarding)

**Expected:** Route protection intercepts and sends recovery sessions to /reset-password

### Test 9: After successful reset, cannot navigate back to reset-password
**Steps:**
1. Complete a successful password reset (Test 7)
2. After redirect to /, attempt to navigate to /reset-password via URL
3. Verify the app does NOT show reset-password screen (redirects to / since isPasswordRecovery is cleared)

**Expected:** Reset-password screen is inaccessible after recovery flag is cleared

### Test 10: Forgot Password with invalid email shows Supabase error
**Steps:**
1. Navigate to /login
2. Enter "not-an-email" in the email field
3. Tap "Forgot Password?"
4. Verify an error message from Supabase is displayed

**Expected:** Supabase validation error shown to user

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
