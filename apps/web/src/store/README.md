# Client state

`ui.ts` uses Zustand for short-lived toast messages. Account data is loaded from PostgreSQL through the API and the kingdom provider; it is not persisted in browser storage.
