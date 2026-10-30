# PostgreSQL + Prisma

`schema.prisma` defines accounts, hashed sessions, ingredients, recipes, recipe ingredients, favorites, shopping lists/items, meal plans, notifications, and inventory activity. Committed SQL migrations live in `migrations/`. `catalog.ts` and `seed.ts` seed the shared recipe catalog. The explicit `pnpm run db:seed:demo` command also creates the three local demo accounts documented in the root README, preserving existing accounts and their data. See the root README for `pnpm run setup` and managed database configuration.
