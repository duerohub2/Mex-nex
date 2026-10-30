#!/usr/bin/env node
import { spawn } from "node:child_process";

const children = [];
let stopping = false;

function launch(label, args) {
  const child = spawn(process.execPath, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      HOST: process.env.HOST || "127.0.0.1",
      PORT: process.env.PORT || "3000",
      DEMO_ADAPTER_PORT: process.env.DEMO_ADAPTER_PORT || "18789"
    }
  });
  children.push(child);
  child.on("error", (error) => {
    console.error(`[${label}] Não foi possível iniciar: ${error.message}`);
    shutdown(1);
  });
  child.on("exit", (code) => {
    if (!stopping && code !== 0) {
      console.error(`[${label}] Encerrou com código ${code ?? "desconhecido"}.`);
      shutdown(code || 1);
    }
  });
}

function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill("SIGTERM");
  }
  const forceStop = setTimeout(() => {
    for (const child of children) {
      if (child.exitCode === null) child.kill("SIGKILL");
    }
    process.exit(code);
  }, 1500);
  forceStop.unref();
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("\nMEX-NEX — MODE DEMO LOKAL");
console.log("Gateway demo : ws://127.0.0.1:18789");
console.log("Aplikasi web : http://127.0.0.1:3000");
console.log("Hentikan dengan Ctrl+C.\n");

launch("Gateway Demo", ["server/demo-gateway-adapter.js"]);
launch("Aplikasi Web", ["server/index.js", "--dev"]);
