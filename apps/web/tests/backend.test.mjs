import assert from "node:assert/strict";
import test from "node:test";
import { backendURL } from "../src/lib/api/backend.ts";

test("development uses the local API", () => {
  assert.equal(backendURL({ NODE_ENV: "development" }), "http://127.0.0.1:4000");
});
test("production requires API_URL", () => {
  assert.throws(() => backendURL({ NODE_ENV: "production" }), /Set API_URL/);
});
test("deployed origin tolerates whitespace and trailing slash", () => {
  assert.equal(backendURL({ API_URL: " https://kitchen.onrender.com/ " }), "https://kitchen.onrender.com");
});
test("invalid API configuration fails before fetching", () => {
  for (const API_URL of ["https://example.com/api", "https://example.com/health", "file:///tmp", "https://user:secret@example.com", "https://example.com?query=1"]) {
    assert.throws(() => backendURL({ API_URL }));
  }
});
