# MealTale implementation

The user is the Kitchen Keeper of an enchanted medieval kitchen.

1. **Project setup:** pnpm workspace with separate Next.js web and Node.js API packages, TypeScript, Tailwind, reusable UI and feature folders.
2. **Fantasy design system:** forest, moss, parchment, gold; Cormorant Garamond headings, Geist body; accessible dialogs, forms, cards, notices, responsive navigation.
3. **Story landing:** original generated environment artwork, story, four kingdom features, journey, working registration and private demo entry.
4. **Accounts and PostgreSQL:** Prisma schema/migration, salted scrypt passwords, hashed opaque database sessions, protected layouts, account-scoped APIs. A custom credentials/session implementation is used rather than Auth.js.
5. **Core features:** ingredient CRUD/search/filter/sort, recipe discovery/favorites/details, shopping lists/items/quantity edits, weekly meal planning and replacement/removal.
6. **Smart features:** exact ingredient and unit-aware matching, expiry exclusions, missing-ingredient market lists, pantry deduction on cooking, in-app freshness alerts, event-based Recharts analytics.
7. **Verification:** strict TypeScript, ESLint, production build, matcher unit tests, HTTP smoke test, PostgreSQL integration/ownership tests, and browser checks.

## Deliberate boundaries

- Matching is deterministic, not an AI integration.
- Notifications are in-app, refreshed on pantry reads or mutations. No email/push delivery or scheduled worker is configured.
- Recipes are a seeded shared catalog; user-created recipes are not part of this version.
- Password reset, email verification, and email address changes are not implemented.
- The login/demo rate limiter is process-local; multi-instance public deployment should use a shared rate limiter.
- Demo accounts persist as isolated accounts. Configure a retention policy before offering unrestricted public demos.
- The frontend and backend are ready to configure for their hosting environments; no deployment was requested or performed.
