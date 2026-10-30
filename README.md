# MealTale

A magical kingdom's kitchen. You are its **Kitchen Keeper**: protect the Royal Vault, learn from the Ancient Cookbook, complete Market Quests, and prepare the Royal Feast.

## Workspace structure

```text
mealtale/
├── apps/
│   ├── web/                          # Next.js, React, TypeScript, Tailwind
│   │   ├── package.json              # Web dependencies and commands
│   │   ├── .env.example
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── eslint.config.mjs
│   │   ├── public/
│   │   │   ├── images/kingdom/
│   │   │   ├── fonts/
│   │   │   ├── icons/
│   │   │   └── textures/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx         # Root layout
│   │   │   │   ├── page.tsx           # Current starter homepage
│   │   │   │   ├── globals.css
│   │   │   │   ├── (marketing)/       # Future cinematic landing page
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   └── (kingdom)/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── royal-vault/
│   │   │   │       ├── ancient-cookbook/
│   │   │   │       ├── market-quest/
│   │   │   │       ├── royal-feast/
│   │   │   │       ├── analytics/
│   │   │   │       └── settings/
│   │   │   ├── components/           # ui, layout, landing, feature UI
│   │   │   ├── lib/                  # api, auth, validations, constants
│   │   │   ├── hooks/                # Future custom React hooks
│   │   │   ├── store/                # Future Zustand state
│   │   │   └── styles/               # Fantasy design system guidance
│   │   └── tests/
│   └── server/                       # Independent Node.js + TypeScript API
│       ├── package.json              # Server dependencies and commands
│       ├── .env.example
│       ├── tsconfig.json
│       ├── prisma/                   # Schema/migrations in phase 04
│       │   └── migrations/
│       ├── src/
│       │   ├── index.ts              # Server startup
│       │   ├── app.ts                # GET /health and JSON 404
│       │   ├── app.test.ts           # HTTP smoke test
│       │   ├── config/
│       │   ├── lib/                  # Future database and server helpers
│       │   ├── middleware/
│       │   ├── jobs/                 # Future expiry notification jobs
│       │   └── modules/
│       │       ├── auth/
│       │       ├── royal-vault/
│       │       ├── ancient-cookbook/
│       │       ├── market-quest/
│       │       ├── royal-feast/
│       │       ├── alerts/
│       │       └── analytics/
│       └── tests/
├── docs/roadmap.md
├── package.json                      # npm workspace commands
└── package-lock.json                 # One shared dependency lockfile
```

Reserved folders contain `.gitkeep` or README files so Git retains them. They are not implemented screens or APIs. Next.js exposes a route only when its `page.tsx` or `route.ts` exists. `(marketing)`, `(auth)`, and `(kingdom)` are route groups and do not appear in URLs.

## Local development

Use Node.js **22.18+** (native TypeScript execution for the server) and npm. Run from the repository root:

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env
npm run dev:web
```

In a second terminal:

```bash
npm run dev:server
```

Web: http://localhost:3000. Server health: http://localhost:4000/health. `npm run dev` also starts the web app. The server reads `apps/server/.env`; its default port is 4000. The API uses Node's HTTP server with no framework dependency yet.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
npm run start:server
```

`build` produces the Next.js production app. The server runs its TypeScript source directly; `typecheck` checks both packages. Each app can also be operated independently using `npm run <command> --workspace=@mealtale/web` or `--workspace=@mealtale/server`.

## Implementation boundaries

- Web owns pages, components, browser interactions, and the future Auth.js integration.
- Server owns business rules, database access, and future protected APIs. Decide how Auth.js identity is verified by the separate server in phase 04; cross-origin API access also needs an explicit CORS or proxy policy at that point.
- Prisma, PostgreSQL, Auth.js, and Zustand are planned, not installed or connected. `DATABASE_URL` is a local example, not a provisioned database.
- The homepage is still the Next.js starter. The fantasy design system and cinematic landing page are phases 02 and 03.
- Deploy `apps/web` on Vercel with the repository as the workspace root and `apps/web` as the project root. Deploy `apps/server` separately to a Node.js host, and configure its database and API URL there.

See [the full seven-phase roadmap](docs/roadmap.md). This change prepares the project structure; it does not create a GitHub repository or deploy either app.
