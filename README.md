# URL Shortener

A URL shortening service built with Next.js, Supabase, and Upstash Redis.

## Live Demo

https://url.ericyhliu.com

## Tech Stack

- **Next.js** — frontend and API routes
- **Supabase (Postgres)** — persistent storage for URL mappings
- **Upstash Redis** — global counter for short code generation and lookup cache
- **Sqids** — encodes the incrementing counter into a random-looking short code
- **Radix UI Themes** — UI components

## Architecture

**Write path** (`POST /api/shorten`):
1. Validate the request and check rate limit (100 requests/hour per IP)
2. Atomically increment a counter in Redis
3. Encode the counter with Sqids to produce a short code (e.g. `x7kP2m`)
4. Insert `{ short_code, long_url }` into Postgres

**Read path** (`/:shortCode`):
1. Next.js middleware intercepts the request before any rendering
2. Check Redis cache for the short code
3. On cache miss, query Postgres and populate the cache
4. Return a 302 redirect to the original URL

## Running Locally

### Prerequisites

- Node.js 18+
- pnpm
- A [Supabase](https://supabase.com) project
- An [Upstash](https://upstash.com) Redis database

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Create the `urls` table in Supabase:

```sql
CREATE TABLE urls (
  short_code VARCHAR(12) PRIMARY KEY,
  long_url   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Copy `.env.local` and fill in your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

4. Start the dev server:

```bash
pnpm dev
```

## Tests

```bash
pnpm test
```

## Deployment

The app is deployed on Vercel. Upstash Redis is provisioned via the Vercel Storage integration, which automatically injects the `KV_*` environment variables. Supabase credentials are added manually in the Vercel project settings.
