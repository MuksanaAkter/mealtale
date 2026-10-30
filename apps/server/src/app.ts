import { createServer } from "node:http";

export function createApp() {
  return createServer((request, response) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");

    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200);
      response.end(JSON.stringify({ status: "ok", service: "mealtale-server" }));
      return;
    }

    response.writeHead(404);
    response.end(JSON.stringify({ error: "Not found" }));
  });
}
