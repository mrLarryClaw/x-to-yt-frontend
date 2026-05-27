# X-to-YouTube Frontend — Specification

## Overview

Personal PWA that lets an authorized user paste an X.com post URL and save the video to their private YouTube account. Backend handles download/upload; frontend provides the UI.

---

## Architecture

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PWA:** next-pwa or manual service worker
- **Backend API:** `https://x-to-yt-backend.up.railway.app` (separate service)
- **Auth:** Google OAuth via redirect to backend

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL |

---

## Pages

### `/` — Home (Paste & Submit)
- URL paste field (auto-focused on load)
- Submit button (disabled for empty/invalid URLs)
- Connected state shows "Save to YouTube" CTA
- Unauthenticated shows "Connect YouTube" CTA
- Inline validation feedback
- Immediate job creation feedback (spinner + "Queued...")

### `/history` — Job History
- Paginated list of user's jobs (newest first)
- Each row: source URL (truncated), status badge, timestamp, YouTube link (if completed)
- Tap row → job detail

### `/job/[id]` — Job Detail
- Source URL
- Status badge with stage text
- Progress bar (0-100%) for downloading/uploading
- YouTube link (if completed) with "Open" button
- "Copy link" button
- "Retry" button (only if failed)
- Error message display (if failed)
- Back to history link

### `/settings` — Settings
- Connected account display (avatar, name, email)
- Sign out button
- Allowlist note: "Only authorized Google accounts can use this app"

### `/api/auth/callback` — OAuth Callback Route
- Receives `?code=...` query param from Google redirect
- Calls `POST {backend}/api/auth/google/callback` with code
- Stores session (cookie or localStorage)
- Redirects to `/` with `?auth=success` or `?auth=rejected`

---

## PWA Requirements

### manifest.json
```json
{
  "name": "X to YouTube",
  "short_name": "X2YT",
  "description": "Save X videos to your YouTube",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1A1A2E",
  "theme_color": "#1A1A2E",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker
- Cache app shell (static assets, layout, fonts)
- **Bypass** for:
  - `/api/auth/callback` (no caching, auth sensitive)
  - All `POST`/`DELETE` API routes
  - `/api/me` (dynamic)
- Network-first for pages, cache-first for assets

### Offline State
- Show "You're offline" message when backend unreachable
- Don't cache auth-required pages

---

## Component Inventory

### URL Input
- Large touch-friendly input field
- Paste button (for mobile)
- Clear button when filled
- Validation: must be `https://x.com/*/status/*` or `https://twitter.com/*/status/*`
- Error: red border + message below

### Submit Button
- Full-width, prominent
- States: default, loading (spinner), disabled

### Status Badge
- `queued` → gray "Queued"
- `downloading` → blue "Downloading..."
- `uploading` → blue "Uploading..."
- `completed` → green "Done"
- `failed` → red "Failed"

### Job Row (History)
- Source URL (truncated, single line)
- Status badge (right side)
- Timestamp (relative: "2 min ago")
- YouTube icon if completed

### Success Screen
- Big checkmark / completion animation
- YouTube video link (clickable)
- "Copy link" button
- "View on YouTube" button
- "Submit another" link

### Error Screen
- Error icon
- Error message (user-friendly)
- "Retry" button if applicable

---

## Auth Flow (Full)

1. User on frontend, not authenticated → sees "Connect YouTube" button
2. Clicks "Connect YouTube" → `window.location.href = '{backend}/api/auth/google/start'`
3. Google OAuth consent page (in same tab)
4. Google redirects to `{frontend}/api/auth/callback?code=...`
5. Callback route:
   - `POST {backend}/api/auth/google/callback` with `code`
   - Backend returns `{ session: {...}, user: {...} }`
   - Store session (httpOnly cookie or localStorage)
   - Redirect to `/`
6. Frontend shows authenticated state

### Session Management
- Store auth token in httpOnly cookie (preferred) or localStorage
- `GET /api/me` on app load to verify session
- `POST /api/auth/logout` on sign out

---

## Polling Logic

1. After job creation, poll `GET /api/jobs/:id` every 2 seconds
2. Stop polling when status is `completed` or `failed`
3. Show progress update on each poll
4. If poll fails (network error), retry with exponential backoff (max 3 retries)
5. On `completed`, show success screen with YouTube link
6. On `failed`, show error screen with retry option

---

## Design

- **Color:** Dark theme (#1A1A2E background, white text)
- **Accent:** Blue (#3B82F6) for CTAs
- **Success:** Green (#22C55E)
- **Error:** Red (#EF4444)
- **Font:** System font stack (no custom fonts needed)
- **Touch targets:** minimum 44px height
- **Spacing:** Generous padding for mobile

---

## Out of Scope (v1)

- Open sign-up / public access
- iOS-specific optimization
- Bulk upload UI
- Playlist/channel management
- Browser extension
- Push notifications
- SSE / WebSocket

---

## File Structure

```
x-to-yt-frontend/
├── SPEC.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── sw.js                 # Service worker
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Home / paste screen
│   │   ├── globals.css
│   │   ├── history/
│   │   │   └── page.tsx
│   │   ├── job/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── auth/
│   │           └── callback/
│   │               └── route.ts
│   ├── components/
│   │   ├── UrlInput.tsx
│   │   ├── SubmitButton.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── JobRow.tsx
│   │   ├── SuccessScreen.tsx
│   │   ├── ErrorScreen.tsx
│   │   └── ConnectPrompt.tsx
│   ├── lib/
│   │   ├── api.ts            # API client functions
│   │   └── auth.ts           # Auth helpers
│   └── types/
│       └── index.ts
└── tests/
    ├── ...
```

---

## Deployment

### Vercel (preferred)
- Connect GitHub repo
- Set `NEXT_PUBLIC_API_URL` environment variable
- Deploys on push to main

### Alternative: Railway
- `npx create-next-app` in Railway CLI
- Same env vars

### Backend URL
- Use `https://x-to-yt-backend.up.railway.app` as `NEXT_PUBLIC_API_URL`
- Update when backend URL changes