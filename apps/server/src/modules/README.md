# Feature boundaries

HTTP route dispatch and account ownership checks currently live in `src/app.ts`; matching and starter data are in `src/services/`, and Prisma/password/session primitives are in `src/lib/`. These feature folders retain the roadmap boundaries for future extraction as each feature grows. They do not provide additional endpoints.
