import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { createApp } from "./app.ts";

test("health responds and unknown routes or methods return 404", async (t) => {
  const server = createApp();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );
  const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    status: "ok",
    service: "mealtale-server",
  });
  assert.equal((await fetch(`${baseUrl}/unknown`)).status, 404);
  assert.equal(
    (await fetch(`${baseUrl}/health`, { method: "POST" })).status,
    404,
  );
});
