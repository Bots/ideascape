# Supabase Authentication Implementation Plan

> **For Hermes:** Use subagent-driven-development and test-driven-development to implement this plan task-by-task.

**Goal:** Add production-ready email authentication, session-aware navigation, sign-out, and provider-ready GitHub/Google OAuth flows to IdeaScape.

**Architecture:** Keep Supabase calls behind a small authentication service that reuses the existing lazy `getSupabaseClient()` singleton. Add an `AuthProvider` that restores the initial session and subscribes to auth-state changes, then expose sign-in and sign-up routes through React Router. Email auth is usable immediately; OAuth entry points are implemented but documented as requiring provider credentials in the hosted Supabase dashboard.

**Tech Stack:** React 19, TypeScript, React Router, Supabase JS, Zod, Vitest, Testing Library, Biome.

---

## Scope and acceptance criteria

- Anonymous visitors can open `/sign-in` and `/sign-up`.
- Email/password sign-in calls `signInWithPassword`, reports errors, and returns home on success.
- Email/password sign-up calls `signUp`, uses `/auth/callback` as the email redirect, and displays confirmation guidance.
- GitHub and Google buttons call `signInWithOAuth` with `/auth/callback` as the redirect.
- The app restores the current Supabase session and reacts to later auth-state changes.
- Authenticated visitors see their email and can sign out.
- Anonymous visitors see sign-in and create-account navigation.
- Auth loading, pending submission, success, and error states are accessible.
- No secret or service-role credential enters source control.
- OAuth documentation clearly states that neither provider is enabled in the hosted project yet.

## Task 1: Record infrastructure state

**Files:**
- Modify: `PLAN.md`
- Modify: `README.md`

1. Mark hosted Supabase linking complete in `PLAN.md`.
2. Replace the generic link placeholder in `README.md` with project reference `icvscetnellunorarhvt`.
3. Verify with `git diff --check`.

Expected: documentation contains no credential values and the diff has no whitespace errors.

## Task 2: Add the authentication service with strict TDD

**Files:**
- Create: `src/features/auth/auth-service.test.ts`
- Create: `src/features/auth/auth-service.ts`

### 2.1 Email sign-in

1. Write a test that supplies a narrow fake auth client, calls `signInWithEmail`, and expects `signInWithPassword({ email, password })`.
2. Run `npm run test:run -- src/features/auth/auth-service.test.ts`.
3. Verify RED because `auth-service.ts` does not exist.
4. Add minimal `signInWithEmail` implementation.
5. Verify GREEN with the same command.

### 2.2 Email sign-up

1. Write a failing test expecting `signUp` with email, password, and `emailRedirectTo: ${window.location.origin}/auth/callback`.
2. Verify RED.
3. Add minimal `signUpWithEmail` implementation.
4. Verify GREEN.

### 2.3 OAuth sign-in

1. Write failing parameterized tests for `github` and `google` expecting `signInWithOAuth({ provider, options: { redirectTo } })`.
2. Verify RED.
3. Add a narrow `OAuthProvider = "github" | "google"` type and `signInWithOAuth` implementation.
4. Verify GREEN.

### 2.4 Errors and sign-out

1. Write failing tests proving every service method throws the Supabase error and that `signOut` invokes `auth.signOut()`.
2. Verify RED.
3. Add one shared `throwIfError` helper and the minimal sign-out behavior.
4. Verify GREEN and run `npm run test:run`.

The exported API should be:

```ts
export type AuthCredentials = { email: string; password: string };
export type OAuthProvider = "github" | "google";

export function signInWithEmail(credentials: AuthCredentials): Promise<void>;
export function signUpWithEmail(credentials: AuthCredentials): Promise<void>;
export function signInWithOAuth(provider: OAuthProvider): Promise<void>;
export function signOut(): Promise<void>;
```

## Task 3: Add session restoration and subscription with strict TDD

**Files:**
- Create: `src/features/auth/auth-provider.test.tsx`
- Create: `src/features/auth/auth-provider.tsx`
- Modify: `src/app/providers.tsx`

### 3.1 Restore initial session

1. Write a consumer component that renders `loading`, `anonymous`, or the user's email from `useAuth()`.
2. Inject a fake client into `AuthProvider` and write a failing test proving it initially renders loading then restores the user returned by `getSession()`.
3. Verify RED because the provider is absent.
4. Implement `AuthProvider` with `{ user: null, isLoading: true }` and an effect that calls `getSession()`.
5. Verify GREEN.

### 3.2 Listen for auth changes

1. Write a failing test that captures the `onAuthStateChange` callback and proves firing it updates the rendered user.
2. Verify RED.
3. Subscribe in the effect and update state from the callback's session.
4. Verify GREEN.

### 3.3 Cleanup and failure state

1. Write failing tests that unmounting calls `subscription.unsubscribe()` and a failed `getSession()` resolves to anonymous instead of leaving an infinite loader.
2. Verify RED.
3. Add effect cleanup, mounted guarding, and a non-sensitive provider error message.
4. Verify GREEN and run the complete test suite.

### 3.4 Install at app boundary

1. Wrap children with `AuthProvider` inside `src/app/providers.tsx`, below `BrowserRouter` and above page components.
2. Run `npm run typecheck` and the full tests.

The public context should expose only:

```ts
type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};
```

Mutations remain in `auth-service.ts` to avoid coupling UI tests to provider internals.

## Task 4: Add routed authentication UI with strict TDD

**Files:**
- Create: `src/features/auth/auth-page.test.tsx`
- Create: `src/features/auth/auth-page.tsx`
- Create: `src/features/auth/auth-callback-page.tsx`
- Create: `src/features/auth/auth-navigation.test.tsx`
- Create: `src/features/auth/auth-navigation.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

### 4.1 Sign-in form

1. Write a failing test rendering the sign-in mode in `MemoryRouter`, entering an email/password, submitting, and expecting `signInWithEmail`.
2. Verify RED.
3. Implement labels, inputs, required constraints, submit handling, and a disabled pending button.
4. On success navigate to `/`; on failure render `role="alert"` with a user-safe message.
5. Verify GREEN.

### 4.2 Sign-up form

1. Write failing tests proving sign-up calls `signUpWithEmail`, displays `Check your email`, and links back to sign-in.
2. Verify RED.
3. Add sign-up mode and success state.
4. Verify GREEN.

### 4.3 OAuth controls

1. Write failing tests proving GitHub and Google buttons invoke their matching provider.
2. Verify RED.
3. Add provider buttons and a separator; keep them visible as provider-ready features.
4. Display returned Supabase configuration errors rather than claiming provider success.
5. Verify GREEN.

### 4.4 Session-aware navigation

1. Mock `useAuth()` in navigation tests.
2. Write failing tests proving anonymous users see sign-in/sign-up links and authenticated users see their email plus sign-out.
3. Verify RED.
4. Implement `AuthNavigation`; sign-out errors use an accessible alert.
5. Verify GREEN.

### 4.5 Routes and callback

1. Update `App.tsx` to declare `/`, `/sign-in`, `/sign-up`, and `/auth/callback` routes.
2. Add an `AuthCallbackPage` that communicates that sign-in is being completed and links home; session parsing remains Supabase JS's responsibility.
3. Update `App.test.tsx` to render with `MemoryRouter` and mock anonymous auth state.
4. Verify focused tests and then `npm run test:run`.

## Task 5: Document provider configuration and update roadmap

**Files:**
- Modify: `README.md`
- Modify: `PLAN.md`

1. Document that email auth is enabled in the hosted project.
2. Document the required Supabase Dashboard path: **Authentication → Sign In / Providers**.
3. State that GitHub and Google require client IDs/secrets and are not enabled yet.
4. Document callback URLs:
   - Supabase provider callback: `https://icvscetnellunorarhvt.supabase.co/auth/v1/callback`
   - App callback in Supabase URL configuration: local and production `/auth/callback` URLs.
5. Mark the email/OAuth authentication roadmap item complete only if code, tests, and documentation all pass. Clarify provider-dashboard prerequisites next to it.
6. Run `git diff --check`.

## Task 6: Final verification and source-control safety

1. Run focused auth tests:
   `npm run test:run -- src/features/auth`
2. Run all quality checks:
   `npm run check`
3. Run formatting verification:
   `npm run format:check`
4. Build production assets:
   `npm run build`
5. Inspect changed paths and ignored files:
   `git status --short --ignored`
6. Verify `.env.local` remains ignored and is not staged:
   `git check-ignore -v .env.local`
7. Scan tracked diffs for accidental Supabase credentials without printing `.env.local`.
8. Run `git diff --check` and review `git diff --stat`.
9. Commit only source, tests, plans, and documentation with a conventional commit.
10. Push only after a GitHub `origin` exists and its owner/repository are verified.

## Expected commit sequence

```text
docs: record hosted Supabase linkage
feat(auth): add Supabase authentication service
feat(auth): restore and observe user sessions
feat(auth): add sign-in and sign-up routes
feat(auth): add session-aware navigation
 docs: document authentication provider setup
```

Commits may be consolidated before publishing if the local repository has no configured remote, but tests must remain green at every implementation checkpoint.
