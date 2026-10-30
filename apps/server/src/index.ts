import { createApp } from "./app.ts";

const port = Number(process.env.PORT ?? 4000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const server = createApp();
server.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
server.listen(port, process.env.HOST ?? "127.0.0.1", () =>
  console.log(`MealTale server listening on port ${port}`),
);
