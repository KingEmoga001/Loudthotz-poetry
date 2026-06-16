---
name: Hero Image Upload Storage
description: How hero carousel image uploads work — why Firebase Storage was replaced and what the current architecture is.
---

Firebase Storage browser uploads fail in Replit due to CORS (bucket doesn't allow `*.picard.replit.dev` origin) and public access prevention on the GCS bucket prevents `makePublic()`.

**Fix:** Images are uploaded via the Express api-server (port 3000) which uses Replit Object Storage (`@google-cloud/storage` with sidecar credentials at `http://127.0.0.1:1106`). The frontend POSTs the file to `/api/uploads/hero-image` (proxied by Vite to `localhost:3000`). The server stores the file in `DEFAULT_OBJECT_STORAGE_BUCKET_ID` and returns a relative URL `/api/uploads/hero-image/:key` where `:key` is base64url-encoded object name. Images are served back through the same Express route.

**Why:** Firebase Storage CORS + public access prevention make browser-direct uploads impossible from Replit's domain without external CLI tools. Server-side upload bypasses both constraints.

**How to apply:** Any future file upload feature should go through the api-server upload endpoint pattern, not browser-direct Firebase Storage.
