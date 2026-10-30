# Development reference

Run these commands from the repository root. For product features, see [MealTale](../README.md). For hosting, see [deployment](deployment.md).

## Quick Start

### Requirements

- Node.js **22.18+** for the server’s native TypeScript execution.
- pnpm **10.30.1**.
- PostgreSQL **18** for the bundled local setup, or an existing PostgreSQL connection.

From the repository root:

```bash
# Install workspace dependencies
pnpm install

# Start the database, generate Prisma Client, apply migrations, seed recipes
pnpm run setup

# Create the three documented local demo accounts
pnpm run db:seed:demo

# Start the web app and API together
pnpm run dev
```

- **Web:** [http://localhost:3000](http://localhost:3000)
- **API health:** [http://127.0.0.1:4000/health](http://127.0.0.1:4000/health)
- **Bundled PostgreSQL:** `127.0.0.1:54329`

`pnpm run dev:web` and `pnpm run dev:server` start the apps separately.

## Useful Commands

| Command                 | What it does                                                     |
| ----------------------- | ---------------------------------------------------------------- |
| `pnpm run setup`        | Start DB, generate Prisma Client, apply migrations, seed recipes |
| `pnpm run dev`          | Start the local database, web app, and API                       |
| `pnpm run dev:web`      | Start only the Next.js app                                       |
| `pnpm run dev:server`   | Start only the API                                               |
| `pnpm run db:start`     | Start the bundled local PostgreSQL instance                      |
| `pnpm run db:generate`  | Generate Prisma Client                                           |
| `pnpm run db:migrate`   | Apply committed database migrations                              |
| `pnpm run db:seed`      | Seed or update the eight shared recipes                          |
| `pnpm run db:seed:demo` | Seed recipes and create any missing demo accounts                |
| `pnpm run lint`         | Run frontend ESLint                                              |
| `pnpm run typecheck`    | Check TypeScript in both apps                                    |
| `pnpm test`             | Run health, matching, and database integration tests             |
| `pnpm run build`        | Create the production web build                                  |
| `pnpm start`            | Serve the production web build                                   |
| `pnpm run start:server` | Start the separate API without watch mode                        |

## Database & Environment

### Automatic local PostgreSQL

`scripts/local-db.mjs` uses `/usr/lib/postgresql/18/bin` by default. Set `POSTGRES_BIN` to your installation directory if needed.

The script initializes `.local/postgres`, generates a random database password in the ignored `apps/server/.env`, and starts PostgreSQL on loopback port `54329`. You do not need to write a database password manually for this mode.

To stop the bundled database:

```bash
/usr/lib/postgresql/18/bin/pg_ctl -D .local/postgres stop
```

### Existing or managed PostgreSQL

1. Copy `apps/server/.env.example` to `apps/server/.env`.
2. Replace the placeholder `DATABASE_URL` with your real connection URL.
3. Run `pnpm run db:generate`, `pnpm run db:migrate`, and `pnpm run db:seed`.

When an external database is configured, `db:start` leaves it alone. Do not copy the placeholder URL when you want the automatic local database setup.

| Variable       | File / environment     | Purpose                                                   |
| -------------- | ---------------------- | --------------------------------------------------------- |
| `DATABASE_URL` | `apps/server/.env`     | PostgreSQL connection                                     |
| `PORT`         | `apps/server/.env`     | API port; default `4000`                                  |
| `HOST`         | `apps/server/.env`     | API bind address; default `127.0.0.1`                     |
| `WEB_ORIGIN`   | `apps/server/.env`     | Allowed web origin; local default `http://localhost:3000` |
| `API_URL`      | `apps/web/.env.local`  | Server-only API address; default `http://127.0.0.1:4000`  |
| `POSTGRES_BIN` | Shell environment      | Local PostgreSQL binary directory override                |
| `NODE_ENV`     | Deployment environment | Set to `production` on production hosts                   |

### How accounts and data work

- The API owns all database access; the frontend never imports Prisma or database credentials.
- Next.js proxies browser calls through `/api/backend/*`, keeping session cookies on the web origin.
- Passwords use unique salts and scrypt. Session tokens are random; only their SHA-256 hashes are stored in PostgreSQL.
- Browser sessions use HTTP-only, SameSite=Lax cookies and expire after seven days.
- Protected operations enforce user ownership on the server. Mutations require JSON and validate origin.
- Recipe cooking deducts ingredients in a serializable database transaction, using the earliest-expiring usable stock first.

## Checks & Tests

```bash
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run build
```

The database integration test creates temporary test accounts and removes only those accounts afterward. It checks authentication, validation, pantry CRUD, cooking deductions, shopping, meal replacement/removal, profile updates, notifications, logout revocation, and rejection of cross-user access.

Set up the database before running tests. The database integration test is skipped when `DATABASE_URL` is absent; health and ingredient-matching tests still run. Initial builds need network access to download the optimized Google Fonts.

## Deployment & Current Boundaries

The web and API are deployed separately. Vercel can host `apps/web`; the Node API and PostgreSQL need compatible hosts. Generate Prisma Client and apply migrations as part of deployment.

Set a private `API_URL` for Next.js, your database provider’s `DATABASE_URL` and TLS settings, the exact HTTPS `WEB_ORIGIN`, and `NODE_ENV=production`. Use `HOST=0.0.0.0` only when required by the API host or container.

Before a public multi-instance deployment, configure a shared authentication rate limiter and a retention policy for private demo accounts. The current limiter is process-local.

Current boundaries:

- Recipe matching is deterministic; no external AI service is configured.
- Recipes are a shared seeded catalog; custom recipe authoring is not implemented.
- Notifications are in-app; scheduled email and push delivery are not configured.
- Password reset, email verification, and email-address changes are not implemented.
- Authentication is custom database-session auth; Auth.js is not installed.
- A production deployment has not been performed.

See [the implementation roadmap](roadmap.md) for the completed flow and remaining extensions.
