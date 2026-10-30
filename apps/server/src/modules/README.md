# Server modules

Feature folders own their HTTP handlers, business rules, and validation once implemented.

- `auth/`: authentication integration and Kitchen Keeper identity.
- `royal-vault/`: ingredients, quantities, expiry tracking.
- `ancient-cookbook/`: recipes and ingredient matching.
- `market-quest/`: shopping lists generated from recipes and inventory.
- `royal-feast/`: meal planning.
- `alerts/`: expiry notifications.
- `analytics/`: waste, pantry usage, and meal summaries.

Validate inputs and enforce user ownership before exposing data routes. The current server exposes only `GET /health`.
