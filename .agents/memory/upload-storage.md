---
name: Hero Image Upload Storage
description: How hero carousel image uploads work — current architecture uses Firebase Storage direct from browser.
---

## Current approach (Hostinger-ready)
Browser uploads directly to Firebase Storage using `uploadBytes` + `getDownloadURL` from `firebase/storage`. Returns a permanent public CDN URL stored in Firestore — no proxy server needed.

**Code:** `artifacts/loudthotz/src/lib/firestore.ts` → `uploadHeroImage()`
**Firebase init:** `artifacts/loudthotz/src/lib/firebase.ts` exports `storage` via `getStorage(app)`

## Express route status
`artifacts/api-server/src/routes/uploads.ts` uses `firebase-admin` SDK. The POST route is unused (client uploads directly). The GET proxy returns 410. Kept for optional server-side use if needed.

**Why migrated away from Replit Object Storage:**
- Replit Object Storage sidecar endpoint (`http://127.0.0.1:1106`) is Replit-specific and does not exist on Hostinger
- Client-side Firebase Storage uploads work on any host, need no server credentials, and return permanent CDN URLs

## Hostinger deploy requirements
1. Firebase Storage must be enabled in Firebase console
2. Storage security rules must allow authenticated writes (admin is Firebase Auth user):
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /hero_images/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
3. `VITE_FIREBASE_STORAGE_BUCKET` must be set in the build env (e.g. `loudthotzpoetry.firebasestorage.app`)
4. Existing hero images stored as `/api/uploads/hero-image/...` URLs in Firestore will break — re-upload via admin panel after go-live
