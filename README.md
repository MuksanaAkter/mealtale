<div align="center">
  <img src="apps/web/public/branding/crest.svg" width="76" height="76" alt="MealTale crest" />

# MealTale

### The Enchanted Kitchen

**A little magic. A better kitchen.**

Manage your pantry, discover what you can cook, and turn everyday meals into a story worth keeping.

![Next.js](https://img.shields.io/badge/Next.js-16-172B23?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-355B43?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-563B2B?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-6-C6A66A?style=flat-square&labelColor=172B23)
![pnpm](https://img.shields.io/badge/pnpm-10-C6A66A?style=flat-square&labelColor=172B23)

[Explore the Features](#what-you-can-do) · [User Journey](#try-this-complete-flow) · [Demo Accounts](#three-demo-accounts) · [Project Structure](#project-structure)

<img src="apps/web/public/backgrounds/enchanted-kitchen.png" width="100%" alt="MealTale’s candlelit royal kitchen overlooking an enchanted castle" />

_Good food. Less waste. A story worth keeping._

</div>

---

## Welcome, Kitchen Keeper

Beyond the ancient forest lies a forgotten royal kitchen. Its shelves hold ingredients full of possibility, and its cookbook is waiting for a new chapter.

That chapter belongs to you.

**MealTale** brings a medieval fantasy setting to a practical kitchen management app. Behind the enchanted forests, parchment, and candlelight are real accounts, PostgreSQL-backed data, useful recipe matching, and everyday tools for keeping food from going to waste.

### At a glance

- **Separate web and API apps** in one pnpm workspace.
- **Real database persistence** for accounts, ingredients, favorites, shopping lists, meals, notifications, and activity.
- **Eight seeded recipes** with ingredients, quantities, instructions, and serving information.
- **Three reusable demo logins**, each with its own starter pantry and favorite recipes.
- **Responsive screens**, original artwork, keyboard-accessible dialogs, and reduced-motion support.

## What You Can Do

### 1. Enter Your Kingdom

Create an account, sign in, or explore an isolated demo kingdom from the landing page.

- Register with a keeper name, email, and password.
- Choose an empty pantry or opt into sample ingredients.
- Sign in and out with database-backed sessions.
- Access protected kitchen pages and update your keeper name.
- Keep each account’s pantry, shopping lists, plans, and activity separate.

### 2. Organize the Royal Vault

A home for every ingredient in your kitchen.

- Add, edit, and remove pantry ingredients.
- Record category, quantity, unit, purchase date, expiry date, and storage location.
- Choose an ingredient illustration.
- Search by name and filter by category or freshness.
- Sort by soonest expiry, name, or recently added.
- Switch between grid and list views.
- Mark an ingredient as used, or record an expired ingredient as wasted.

**Supported categories:** Vegetables, Fruits, Dairy, Meat, Seafood, Grains, Spices, Beverages, and Other.

**Supported units:** `g`, `kg`, `ml`, `l`, and `pcs`. Storage locations: Fridge, Freezer, and Pantry.

### 3. Open the Ancient Cookbook

Discover meals you can make with what is already in your vault.

- Browse recipe illustrations, descriptions, cooking times, difficulty, and servings.
- Open complete ingredient lists and step-by-step instructions.
- Search recipes and filter by category, favorites, readiness, or ingredients near expiry.
- See recipes you can cook now and those missing only a few ingredients.
- Save and remove favorites.
- Send missing ingredients directly to a selected market list.
- Mark a recipe as cooked to deduct its ingredients and update the ledger.

> **How matching works:** normalized exact ingredient names and compatible quantities are checked against your pantry. `kg/g` and `l/ml` are converted; expired stock is excluded. This is a transparent matching algorithm, not an AI integration.

### 4. Complete Market Quests

Shop for what is missing, with a list that stays in sync with your plans.

- Create multiple named shopping lists.
- Add ingredients with a category, quantity, and unit.
- Edit quantities, mark purchases, and remove items.
- View ingredients grouped by category and track list completion.
- Generate missing-item lists from recipes without adding duplicate unpurchased entries of the same ingredient and unit.

Purchased items stay on the shopping list until you remove them. Add them to the Royal Vault with their actual quantity and expiry when you get home.

### 5. Plan the Royal Feast

Give the week a little structure and something delicious to look forward to.

- Plan Monday through Sunday.
- Assign recipes to Breakfast, Lunch, and Dinner.
- Move between weeks and return to the current week.
- Replace or remove a planned meal.
- Open a planned recipe to see its preparation details.
- View combined ingredient requirements for the week.

Each planned recipe uses its listed servings. Weekly requirements are totals before subtracting existing pantry stock.

### 6. Listen to the Freshness Guardian

- See **Fresh**, **Expiring soon**, and **Expired** statuses.
- Receive in-app alerts when an ingredient has three days or less remaining.
- Find ingredients that need attention from the dashboard.
- Discover recipes that use ingredients nearing expiry.
- Mark notifications as read.

Alerts refresh when your pantry is opened or updated. Email and push delivery are not configured.

### 7. Read the Kingdom Ledger

Understand what is happening in your kitchen using actual recorded activity.

- View current pantry totals and category distribution.
- Track added, consumed, edited, removed, and wasted inventory events.
- Inspect monthly activity over the last six months.
- See which ingredients you use most frequently.
- Review recorded waste quantities, grouped by unit.
- Read the latest ingredient activity in a detailed ledger.

Charts use the latest 2,000 account activity records. Unlike quantities such as grams, milliliters, and pieces are never added into one misleading total. Removing an item does not count as food waste unless you explicitly record it as wasted.

## Try This Complete Flow

1. **Sign in** with a demo account below, or create your own keeper account.
2. **Open the Royal Vault** and add the ingredients in your kitchen.
3. **Check the Freshness Guardian** to find what should be used first.
4. **Open the Ancient Cookbook** and choose a ready recipe or one missing a few items.
5. **Send missing ingredients to Market Quests**, then mark them purchased after shopping.
6. **Plan the meal in Royal Feast** and mark the recipe cooked when you prepare it.
7. **Return to the Kingdom Ledger** to see pantry consumption and activity update.

## Three Demo Accounts

These are **shared demo accounts**, with regular user permissions. All three use this password:

```text
Keeper@12345
```

| Keeper            | Login email                  | Favorite recipes                                   |
| ----------------- | ---------------------------- | -------------------------------------------------- |
| Rowan Greenleaf   | `rowan@demo.mealtale.local`  | Forest Harvest Soup · The Keeper’s Green Bowl      |
| Willow Hearthwood | `willow@demo.mealtale.local` | Woodland Mushroom Toast · Orchard Morning Porridge |
| Ember Ashford     | `ember@demo.mealtale.local`  | Golden Garden Pasta · Sunday Castle Roast          |

**Every new seeded account receives:**

- 12 pantry ingredients with quantities, storage locations, and purchase/expiry dates.
- One market list containing Butter and Bread.
- One Dinner plan for Forest Harvest Soup on the initial seed date.
- Two favorite recipes, as listed above.
- Actual inventory activity entries for its starter ingredients.

These accounts are created in any database where demo seeding is explicitly enabled, including the live demo deployment. Existing passwords and pantry data are preserved when the seed is rerun. These public logins share editable sample data; use a personal account for your own kitchen.

**Prefer a fresh exploration?** The landing page’s **Take a look around** button creates a separate, private demo account with sample pantry data instead of using one of these shared logins.

## Routes

| Page                | Route               | Purpose                                                         |
| ------------------- | ------------------- | --------------------------------------------------------------- |
| The kingdom story   | `/`                 | Cinematic landing, features, and entry points                   |
| Join the kingdom    | `/register`         | Registration with optional sample pantry                        |
| Welcome home        | `/login`            | Account sign-in or private demo entry                           |
| Kingdom Overview    | `/dashboard`        | Live statistics, freshness, recipes, meals, and recent activity |
| Royal Vault         | `/royal-vault`      | Pantry management                                               |
| Ancient Cookbook    | `/ancient-cookbook` | Recipe discovery, favorites, and cooking                        |
| Market Quests       | `/market-quest`     | Shopping lists and purchases                                    |
| Royal Feast Planner | `/royal-feast`      | Weekly meal planning                                            |
| Kingdom Ledger      | `/analytics`        | Inventory and food activity analytics                           |
| Keeper Settings     | `/settings`         | Profile and account information                                 |

All kingdom pages require a valid session.

## Technology

| Layer          | Implementation                                                             |
| -------------- | -------------------------------------------------------------------------- |
| Web            | Next.js 16 App Router · React 19 · TypeScript                              |
| Styling        | Tailwind CSS 4 · custom fantasy design system                              |
| Interaction    | Motion · React Hook Form · Zod · Zustand                                   |
| Charts & icons | Recharts · Lucide                                                          |
| API            | Separate Node.js HTTP server · TypeScript · Zod                            |
| Database       | PostgreSQL · Prisma ORM · committed SQL migrations                         |
| Authentication | Custom credentials flow · salted scrypt passwords · hashed opaque sessions |
| Workspace      | pnpm, with independent web/server `package.json` files                     |

### Visual identity

Forest green, moss, parchment, dark wood, and antique gold set the tone. Cormorant Garamond headings pair with Geist body text. The original crest, food illustrations, and generated kitchen environment live in the repository; the app does not depend on remote image URLs.

See [the artwork and generation prompt](docs/art-direction.md) for asset details.

## Project Structure

```text
mealtale/
├── apps/
│   ├── web/                         # Next.js frontend
│   │   ├── package.json
│   │   ├── public/
│   │   │   ├── backgrounds/         # Original fantasy environment
│   │   │   ├── branding/            # MealTale crest and favicon
│   │   │   └── illustrations/       # Ingredient and recipe artwork
│   │   └── src/
│   │       ├── app/                 # Pages, layouts, auth/kingdom groups, API proxy
│   │       ├── components/
│   │       │   ├── kingdom/         # Feature views and kingdom shell
│   │       │   ├── landing/         # Interactive kitchen story and 3D book
│   │       │   └── ui/              # Brand, modal, loading, toast
│   │       ├── lib/                 # API client, shared types, helpers
│   │       └── store/               # Zustand UI state
│   └── server/                      # Independent Node.js API
│       ├── package.json
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   ├── catalog.ts           # Eight shared recipes
│       │   └── seed.ts              # Catalog and optional demo accounts
│       └── src/
│           ├── app.ts               # Validated routes and ownership checks
│           ├── index.ts             # HTTP server startup
│           ├── lib/                 # Prisma, passwords, session primitives
│           └── services/            # Matching and starter-data services
├── docs/
│   ├── art-direction.md
│   └── roadmap.md
├── scripts/local-db.mjs
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── package.json                     # Root workspace commands
```

Local database files, `.env` files, generated build output, and agent configuration are excluded from Git.

## Current Scope

- Shared recipe catalog with deterministic pantry matching.
- In-app freshness notifications; email and push delivery are not enabled.
- Custom account/session authentication; password reset and email verification are not implemented.

Technical guides: [Deployment](docs/deployment.md) · [Development reference](docs/development.md).

---

<div align="center">

**Collect thoughtfully. Cook creatively. Waste a little less.**

*Your kingdom starts with what is already in your kitchen.*

</div>
