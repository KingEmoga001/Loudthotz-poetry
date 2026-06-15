---
name: Firebase Architecture — Loudthotz
description: How Firebase is wired into the Loudthotz Poetry Portal
---

# Firebase Architecture

**Why:** User requested full Firebase migration replacing Express + PostgreSQL for all data and auth.

**Firebase project:** loudthotzpoetry (credentials embedded in `src/lib/firebase.ts` — safe, public client config)

## Firestore Collections
- `poems` — published poems with ratings, featured flag, season, theme
- `submissions` — pending/approved/rejected with status field
- `books` — anthology listings with Amazon URLs
- `livestream_status/current` — single doc with isLive, embedUrl, title, etc.
- `livestream_sessions` — past session archive
- `settings/main` — site-wide CMS settings (hero text, upcoming event, donation message)

## Auth
- Firebase Auth email/password for admin only
- Admin creates account in Firebase Console → Authentication → Users → Add user
- `AuthContext.tsx` wraps the whole app; admin routes redirect to `/admin/login` if unauthenticated

## Key Files
- `src/lib/firebase.ts` — Firebase app init (db, auth exports)
- `src/lib/firestore.ts` — All hooks (usePoems, useFeaturedPoems, useLivestreamStatus, etc.) and mutations
- `src/contexts/AuthContext.tsx` — Firebase Auth state
- `src/pages/admin/index.tsx` — Full CMS: Dashboard, Submissions, Poems, Livestream, Books, Settings tabs
- `src/pages/admin/login.tsx` — Admin login gate

## How to Apply
- All public pages import hooks from `@/lib/firestore`, NOT from `@workspace/api-client-react`
- Admin is protected by `useAuth()` from `@/contexts/AuthContext`
- Seed Firestore: Admin → Settings tab → "Initialize Database" button (run once)

**Why no `@workspace/api-client-react` hooks:** Fully replaced by Firestore real-time listeners (onSnapshot) for live updates without polling.
