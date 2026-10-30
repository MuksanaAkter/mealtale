import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, "apps/server/.env");
const bin = process.env.POSTGRES_BIN ?? "/usr/lib/postgresql/18/bin";
const base = resolve(root, ".local");
const data = resolve(base, "postgres");
mkdirSync(base, { recursive: true, mode: 0o700 });
let env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
if (env.includes("DATABASE_URL=") && !env.includes("127.0.0.1:54329")) {
  console.log("Using the database configured in apps/server/.env");
  process.exit(0);
}
if (!existsSync(`${bin}/pg_ctl`))
  throw new Error(
    "Install PostgreSQL or set POSTGRES_BIN; alternatively configure DATABASE_URL in apps/server/.env.",
  );
if (!env.includes("DATABASE_URL=")) {
  const password = randomBytes(24).toString("hex");
  env += `\nPORT=4000\nWEB_ORIGIN=http://localhost:3000\nDATABASE_URL=postgresql://mealtale:${password}@127.0.0.1:54329/mealtale\n`;
  writeFileSync(envPath, env, { mode: 0o600 });
}
const url = new URL(env.match(/^DATABASE_URL=(.+)$/m)[1].replaceAll('"', ""));
function run(command, args, quiet = false) {
  const result = spawnSync(`${bin}/${command}`, args, {
    stdio: quiet ? "pipe" : "inherit",
  });
  if (result.status !== 0) throw new Error(`${command} failed`);
}
if (!existsSync(`${data}/PG_VERSION`)) {
  const passwordFile = resolve(base, "pg-password");
  writeFileSync(passwordFile, decodeURIComponent(url.password), {
    mode: 0o600,
  });
  try {
    run(
      "initdb",
      [
        "-D",
        data,
        "-U",
        "mealtale",
        "--pwfile",
        passwordFile,
        "--auth-host=scram-sha-256",
        "--auth-local=trust",
      ],
      true,
    );
  } finally {
    const { unlinkSync } = await import("node:fs");
    unlinkSync(passwordFile);
  }
}
const status = spawnSync(`${bin}/pg_ctl`, ["-D", data, "status"], {
  stdio: "ignore",
});
if (status.status !== 0)
  run("pg_ctl", [
    "-D",
    data,
    "-l",
    resolve(base, "postgres.log"),
    "-o",
    `-p 54329 -h 127.0.0.1 -k ${base}`,
    "-w",
    "start",
  ]);
const check = spawnSync(
  `${bin}/psql`,
  [
    "-h",
    base,
    "-p",
    "54329",
    "-U",
    "mealtale",
    "-d",
    "postgres",
    "-tAc",
    "SELECT 1 FROM pg_database WHERE datname='mealtale'",
  ],
  { encoding: "utf8" },
);
if (check.status !== 0)
  throw new Error("Could not connect to local PostgreSQL");
if (check.stdout.trim() !== "1")
  run("createdb", ["-h", base, "-p", "54329", "-U", "mealtale", "mealtale"]);
console.log("Local MealTale PostgreSQL ready on 127.0.0.1:54329");
