# Deploy MealTale

This repository contains a Next.js web app and a separate Node.js API. The web app can be deployed on Vercel. This guide keeps the API on Render and PostgreSQL on a managed database.

## 1. Import the web project

In Vercel, choose **Create New → Project**, import `MuksanaAkter/mealtale`, and select:

- Framework: **Next.js**.
- Root Directory: **apps/web**.
- Include source files outside the Root Directory in the Build Step: enabled.
- Install Command: `pnpm install --frozen-lockfile`.
- Build Command: `pnpm run build`.
- Output Directory: Next.js default (`.next`).
- Node.js: **24.x**.

Use the production project domain as the API's `WEB_ORIGIN`. Until an online API is connected, the landing page can render, but authentication and kitchen data need the API.

## 2. Create online PostgreSQL

Create a managed PostgreSQL database. If using Render Postgres, put it in the same region as the API and use its internal connection URL for the Render service. Store the URL as `DATABASE_URL` on the API host; never commit it or put it in a NEXT_PUBLIC variable.

## 3. Deploy the API

Create a Render **Web Service**, select the same GitHub repository, and leave Root Directory blank so the pnpm workspace is available.

Build Command:

```bash
pnpm install --frozen-lockfile --prod=false && pnpm run db:generate
```

Start Command:

```bash
pnpm run db:migrate && pnpm run db:seed && pnpm run start:server
```

For a deployment pipeline with a pre-deploy stage, move migrations and catalog seeding there. The build retains dev dependencies because the Prisma CLI is needed for migrations.

Set the API environment variables:

```text
NODE_ENV=production
NODE_VERSION=24
HOST=0.0.0.0
DATABASE_URL=<managed PostgreSQL connection URL>
WEB_ORIGIN=https://mealtale.vercel.app
```

Use the port assigned by Render. Check the deployed API's `/health` endpoint after startup. The normal seed creates recipes only. To create the three documented demo accounts on the live demo, also set `SEED_DEMO_ACCOUNTS=true` on Render and redeploy. The existing start command runs the seed before starting the API. Existing users and their passwords/data are preserved. Remove this variable after the first successful seed if desired; the accounts remain in PostgreSQL. These are public, shared sample accounts with regular permissions.

## 4. Connect Vercel to the API

In Vercel → Project Settings → Environment Variables, set:

```text
API_URL=https://mealtale-api.onrender.com
```

This is a server-only variable. Redeploy the web project after adding it. `API_URL` is the API base URL without `/api` at the end. `WEB_ORIGIN` must match the exact public web origin, without a trailing slash. Configure preview origins deliberately if preview deployments need database access.

## 5. Verify the live flow

Register a new account, sign in, add an ingredient, open a recipe, update a shopping list, and save a meal. Local database users and their data are not automatically copied to the online database.

## References

- [Vercel monorepos](https://vercel.com/docs/monorepos)
- [Vercel build settings](https://vercel.com/docs/builds/configure-a-build)
- [Render monorepo support](https://render.com/docs/monorepo-support)
- [Render Node deployment](https://render.com/docs/deploy-node-express-app)
- [Render PostgreSQL](https://render.com/docs/postgresql-creating-connecting)

## Login troubleshooting

- A 503 from `/api/backend/state` indicates an API connection problem, before password validation. Check Vercel's `API_URL`, redeploy after any env change, and open the Render service's `/health` URL.
- A 401 from `/api/backend/state` without a cookie is expected: the API is reachable but you are signed out.
- A login 401 means the account/password is incorrect in that database. Enable demo seeding on Render for the README logins.
- A login 403 indicates an origin mismatch. Set Render `WEB_ORIGIN=https://mealtale.vercel.app` (or the actual web origin).
- Render Free may take about a minute to wake up. The web proxy waits up to 75 seconds; if it still times out, retry after startup completes. See [Render service spin-down](https://render.com/docs/free#spinning-down-on-idle).
