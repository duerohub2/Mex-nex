
export const DOCTOR_STATUSES = Object.freeze({ pass: "pass", warn: "warn", fail: "fail" });

export function resolveRuntimeContext({ settings = {}, upstreamGateway = {}, env = process.env } = {}) {
  const gateway = settings.gateway || {};
  const adapterType = String(gateway.adapterType || upstreamGateway.adapterType || env.GATEWAY_ADAPTER || "local").toLowerCase();
  const profiles = gateway.profiles && typeof gateway.profiles === "object" ? gateway.profiles : {};
  const selected = profiles[adapterType] || {};
  const gatewayUrl = String(gateway.url || selected.url || upstreamGateway.url || env.GATEWAY_URL || (
    adapterType === "hermes3d" ? "http://localhost:3000/api/runtime/custom" :
    adapterType === "hermes" ? "ws://localhost:18789" : "http://localhost:7770"
  ));
  const token = String(gateway.token || selected.token || upstreamGateway.token || env.GATEWAY_TOKEN || "");
  return { adapterType, gatewayUrl, token, tokenConfigured: Boolean(token), profiles };
}

export function buildGatewayWarnings({ gatewayUrl = "", studioAccessToken = "", host = "", adapterType = "" } = {}) {
  const warnings = [];
  const remote = (() => { try { const u = new URL(gatewayUrl); return !["localhost", "127.0.0.1", "::1"].includes(u.hostname); } catch { return false; } })();
  if (remote && /^ws:/.test(gatewayUrl)) warnings.push("Remote gateway uses ws:// without TLS; use wss:// for secure remote access.");
  if (remote && host && !studioAccessToken) warnings.push("Public Studio access requires STUDIO_ACCESS_TOKEN.");
  for (const finding of inspectUpstreamGatewayUrl(gatewayUrl, adapterType)) warnings.push(finding.message + " " + finding.fix);
  return warnings;
}
export const buildRemoteGatewayWarnings = ({ gatewayUrl = "", tokenConfigured = false } = {}) =>
  /\.ts\.net(?:[:/]|$)/i.test(gatewayUrl) && !tokenConfigured
    ? ["Remote Tailnet gateway token is missing; pairing/auth failures may appear as 1008/1011/1012."]
    : [];
export const buildCustomRuntimeWarnings = ({ gatewayUrl = "", allowlist = "", nodeEnv = "" } = {}) =>
  nodeEnv === "production" && gatewayUrl && !allowlist
    ? ["Public custom runtime should configure CUSTOM_RUNTIME_ALLOWLIST."]
    : [];
export function buildProfileWarnings({ runtimeContext = {} } = {}) {
  const entries = Object.entries(runtimeContext.profiles || {}).filter(([, p]) => p?.url);
  const seen = new Set();
  return entries.some(([, p]) => seen.has(p.url) || !seen.add(p.url))
    ? ["Multiple runtime profiles share the same endpoint."]
    : [];
}
export function buildGatewayFailureActions({ adapterType = "", message = "", gatewayUrl = "" } = {}) {
  const actions = [];
  if (/401|1008|pairing|required/i.test(message)) actions.push("Check pending device/browser approval and gateway token pairing.");
  if (/\.ts\.net(?:[:/]|$)/i.test(gatewayUrl)) actions.push("Try direct local or LAN access before using a Tailnet-hosted gateway.");
  if (adapterType === "hermes" && /401|1008|pairing/i.test(message)) actions.push("Confirm the gateway is paired and the configured token is current.");
  return actions;
}
export function classifyGatewayFailure({ message = "" } = {}) {
  const value = String(message);
  if (/\b401\b/.test(value)) return { code: "401", label: "Auth rejection" };
  if (/\b1008\b|pairing required/i.test(value)) return { code: "1008", label: "Policy or pairing gate" };
  if (/ECONNREFUSED/i.test(value)) return { code: "ECONNREFUSED", label: "Listener missing" };
  return { code: "UNKNOWN", label: "Unknown gateway failure" };
}
export const summarizeChecks = (checks = []) => checks.some(x => x.status === DOCTOR_STATUSES.fail) ? DOCTOR_STATUSES.fail : checks.some(x => x.status === DOCTOR_STATUSES.warn) ? DOCTOR_STATUSES.warn : DOCTOR_STATUSES.pass;
export const isCustomRuntimeAdapter = type => ["custom", "local", "hermes3d"].includes(String(type || "").toLowerCase());
export const shouldRunHermesChecks = ({ runtimeContext = {} } = {}) => runtimeContext.adapterType === "hermes";
export const shouldRunDemoChecks = ({ runtimeContext = {} } = {}) => runtimeContext.adapterType === "demo";
export const shouldRunCustomChecks = ({ runtimeContext = {} } = {}) => isCustomRuntimeAdapter(runtimeContext.adapterType);
export function buildDoctorJsonReport({ summary, runtimeContext = {}, paths = {}, checks = [] } = {}) {
  const safeRuntime = { ...runtimeContext };
  delete safeRuntime.token;
  return { doctor: "hermes3doctor", summary, runtimeContext: safeRuntime, paths, checks };
}
export function formatDoctorReport({ summary, runtimeContext = {}, checks = [] } = {}) {
  const counts = checks.reduce((a, c) => (a[c.status] = (a[c.status] || 0) + 1, a), {});
  const profiles = Object.keys(runtimeContext.profiles || {});
  return [
    "Hermes3Doctor",
    "Summary: " + String(summary || DOCTOR_STATUSES.pass).toUpperCase(),
    "Selected profile: " + (runtimeContext.adapterType || "unknown"),
    "Configured profiles: " + (profiles.join(", ") || "none"),
    ...checks.reduce((lines, check) => {
      const category = check.category || "General";
      if (!lines.includes(category)) lines.push(category);
      lines.push("[" + check.status + "] " + check.label + ": " + check.message);
      return lines;
    }, []),
    "Check counts: " + Object.entries(counts).map(([k, v]) => k + "=" + v).join(", "),
  ].join("\n");
}
export function parseDoctorArgs(args = []) {
  const result = { json: false, allProfiles: false, profile: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") result.json = true;
    else if (args[i] === "--all-profiles") result.allProfiles = true;
    else if (args[i] === "--profile" && args[i + 1] && !args[i + 1].startsWith("--")) result.profile = String(args[++i]).toLowerCase();
  }
  return result;
}

const DASHBOARD_PORT = "9119";
const API_PORT = "8642";
const WS_PATH = "/api/ws";
const TLS_PORTS = new Set(["443", "8443", "10000"]);
const ENDPOINT_FIX = "Hermes3D connects through its own adapter, not the hermes-agent dashboard. Run `npm run hermes-adapter` with HERMES_API_URL pointing at the Hermes OpenAI-compatible API (port 8642), then connect to the adapter on port 18789.";
const isTailnet = hostname => hostname === "ts.net" || hostname.endsWith(".ts.net");
export function inspectUpstreamGatewayUrl(rawUrl, adapterType = "") {
  const value = typeof rawUrl === "string" ? rawUrl.trim() : "";
  if (!value) return [];
  let parsed;
  try { parsed = new URL(value); } catch { return []; }
  const findings = [];
  const protocol = parsed.protocol.toLowerCase();
  const hostname = parsed.hostname.toLowerCase();
  const port = parsed.port;
  const pathname = parsed.pathname.replace(/\/+$/, "");
  const targetsHermesAgent = String(adapterType || "").trim().toLowerCase() === "hermes-agent";
  if (!targetsHermesAgent && port === DASHBOARD_PORT) findings.push({
    code: "hermes_agent_dashboard_port", severity: "error",
    message: `Port ${DASHBOARD_PORT} is the hermes-agent dashboard, which speaks JSON-RPC 2.0 over /api/ws with single-use ticket auth. Hermes3D cannot talk to it.`,
    fix: ENDPOINT_FIX,
  });
  if (!targetsHermesAgent && pathname === WS_PATH) findings.push({
    code: "hermes_agent_jsonrpc_path", severity: "error",
    message: `${WS_PATH} is the hermes-agent JSON-RPC endpoint, not a Hermes3D gateway.`,
    fix: ENDPOINT_FIX,
  });
  if (port === API_PORT) findings.push({
    code: "hermes_openai_api_port", severity: "error",
    message: `Port ${API_PORT} is the Hermes OpenAI-compatible HTTP API. It serves /v1/chat/completions over HTTP and has no gateway websocket.`,
    fix: "Set HERMES_API_URL to this address and run `npm run hermes-adapter`, then point the gateway URL at the adapter instead.",
  });
  if (protocol === "wss:" && port && !TLS_PORTS.has(port) && isTailnet(hostname)) findings.push({
    code: "tls_on_plain_tailnet_port", severity: "warning",
    message: `wss:// expects TLS, but Tailscale only terminates TLS on ports ${[...TLS_PORTS].join(", ")}. Port ${port} on a tailnet host is almost certainly plain HTTP.`,
    fix: "Either use ws:// against this port, or expose the service with `tailscale serve --https=443 http://127.0.0.1:<port>` and connect to wss://<host> with no port.",
  });
  return findings;
}
