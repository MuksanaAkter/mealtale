# Web utilities

`api/client.ts` calls the same-origin Next.js API proxy. `types.ts` defines feature view types and date/quantity helpers. The web never imports Prisma or database credentials. Authentication and all business operations are verified by the separate server.
