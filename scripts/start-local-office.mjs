#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);

function checkPort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(port, host, () => server.close(resolve));
  });
}

try {
  await checkPort();
} catch {
  console.error("Port " + port + " sedang digunakan. Ubah PORT atau hentikan proses yang memakainya.");
  process.exit(1);
}

console.log("\nMEX-NEX — KANTOR VIRTUAL AI");
console.log("Buka browser: http://" + host + ":" + port);
console.log("Hentikan    : Ctrl+C\n");

const child = spawn(process.execPath, ["server/index.js", "--dev"], {
  stdio: "inherit",
  env: { ...process.env, HOST: host, PORT: String(port) }
});

const stop = () => {
  if (!child.killed) child.kill("SIGTERM");
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", code => process.exit(code ?? 0));
child.on("error", error => {
  console.error("Gagal menjalankan server MEX-NEX:", error.message);
  process.exit(1);
});
