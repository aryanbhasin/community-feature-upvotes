# Network School - Community Feature Requests

A dead simple upvote app for the Network School community in Forest City, Malaysia. Submit and vote on feature requests to help prioritize what the core team should work on next.

## What It Does

- 🗳️ **Submit Requests** - Anyone can propose improvements (e.g., "EVOO for lunch", "more power outlets in NS Cafe")
- ⬆️ **Upvote** - Click to upvote requests you care about (no login required)
- ⏰ **Time Decay** - Old requests naturally sink as they age, keeping fresh ideas at the top
- 🚫 **Spam Prevention** - Cookie-based tracking prevents duplicate votes

## Features

- **No Database** - All data stored in-memory (resets on server restart)
- **No Login Required** - Instant access for first-time visitors
- **Time-Decay Algorithm** - Score = upvotes / age_in_weeks
- **Clean UI** - Black and white theme using Shadcn components

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## How It Works

### User Flows

1. **Landing Page** - See all requests sorted by decay score
2. **Upvote** - Click arrow button → increments immediately (one vote per person per request)
3. **Submit** - Click "Submit Request" → fill form (title, optional description, optional name) → appears at bottom with 0 upvotes

### API Routes

- `GET /api/requests` - Fetch all requests sorted by decay score
- `POST /api/requests` - Create new feature request
- `POST /api/requests/[id]/upvote` - Upvote a request (with spam prevention)

### Time Decay Formula

```
score = upvotes × (1 / age_in_weeks)
```

This ensures that:
- New upvoted requests rise to the top
- Old requests gradually sink even with many upvotes
- The list stays fresh and relevant

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Shadcn/UI** - UI components
- **Tailwind CSS** - Styling
- **In-Memory Storage** - No database needed

## Project Structure

```
src/
├── app/
│   ├── api/requests/        # API routes for CRUD operations
│   └── page.tsx             # Main homepage with request list
├── components/
│   ├── ui/                  # Shadcn UI components
│   └── SubmitRequestDialog.tsx  # Request submission form
└── lib/                     # Utilities
```

## Development Notes

- Auto-refreshes every 10 seconds to update decay scores
- Cookie-based spam prevention (stores upvoted request IDs)
- Responsive design for mobile and desktop
- No authentication or admin features (keeping it simple!)

---

Built for the Network School community 🏨🌴