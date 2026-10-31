// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

let dataDirectory: string;
let officeApi: typeof import("../../app/api/office/route.js");
let aiApi: typeof import("../../app/api/ai/route.js");

const request = (url: string, payload: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

beforeEach(async () => {
  dataDirectory = await mkdtemp(join(tmpdir(), "mex-nex-stage-seven-"));
  process.env.MEX_NEX_DATA_DIR = dataDirectory;
  process.env.AI_PROVIDER = "local";
  process.env.LOCAL_MODEL_BASE_URL = "https://provider.example.test";
  process.env.LOCAL_MODEL_NAME = "integration-test-model";
  process.env.LOCAL_MODEL_API_KEY = "integration-secret";
  vi.resetModules();
  officeApi = await import("../../app/api/office/route.js");
  aiApi = await import("../../app/api/ai/route.js");
});

afterEach(async () => {
  vi.unstubAllGlobals();
  await rm(dataDirectory, { recursive: true, force: true });
  for (const key of [
    "MEX_NEX_DATA_DIR",
    "AI_PROVIDER",
    "LOCAL_MODEL_BASE_URL",
    "LOCAL_MODEL_NAME",
    "LOCAL_MODEL_API_KEY",
  ]) delete process.env[key];
  vi.resetModules();
});

describe("MEX-NEX Stage 7 integration", () => {
  it("keeps office tasks and agent assignments after route module restart", async () => {
    const created = await officeApi.POST(request("http://localhost/api/office", {
      action: "add-task",
      title: "Uji persistensi setelah restart",
      assigneeId: "dev-01",
    }));
    expect(created.status).toBe(200);

    const beforeRestart = await officeApi.GET();
    const stateBefore = await beforeRestart.json();
    expect(stateBefore.tasks[0]).toMatchObject({
      title: "Uji persistensi setelah restart",
      assigneeId: "dev-01",
    });

    vi.resetModules();
    officeApi = await import("../../app/api/office/route.js");
    const afterRestart = await officeApi.GET();
    const stateAfter = await afterRestart.json();

    expect(stateAfter.tasks).toEqual(stateBefore.tasks);
    expect(stateAfter.activity).toEqual(stateBefore.activity);
  });

  it("keeps private Agent chat history across route reloads without exposing provider secrets", async () => {
    const calls: Array<{ body: any; authorization: string | null }> = [];
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        body: JSON.parse(String(init?.body || "{}")),
        authorization: new Headers(init?.headers).get("authorization"),
      });
      return Response.json({
        choices: [{ message: { content: "Hasil analisis Agent tersimpan." } }],
      });
    }));

    const first = await aiApi.POST(request("http://localhost/api/ai", {
      action: "chat",
      agentId: "research-01",
      message: "Analisis kebutuhan produk.",
    }));
    expect(first.status).toBe(200);
    const firstBody = await first.json();
    expect(firstBody.answer).toBe("Hasil analisis Agent tersimpan.");

    const sessionsPath = join(dataDirectory, "ai-sessions.json");
    const stored = JSON.parse(await readFile(sessionsPath, "utf8"));
    expect(stored.conversations[0].messages).toHaveLength(2);

    vi.resetModules();
    aiApi = await import("../../app/api/ai/route.js");
    const second = await aiApi.POST(request("http://localhost/api/ai", {
      action: "chat",
      agentId: "research-01",
      conversationId: firstBody.conversationId,
      message: "Lanjutkan dari hasil sebelumnya.",
    }));
    expect(second.status).toBe(200);
    expect(calls).toHaveLength(2);
    expect(calls[1].body.messages).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: "assistant", content: "Hasil analisis Agent tersimpan." }),
    ]));
    expect(calls[0].authorization).toBe("Bearer integration-secret");

    const runtimeStatus = await aiApi.GET();
    const safe = await runtimeStatus.json();
    expect(JSON.stringify(safe)).not.toContain("integration-secret");
  });

  it("returns a safe, actionable error when the configured AI provider fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      Response.json({ error: { message: "Provider sementara tidak tersedia." } }, { status: 503 }),
    ));

    const response = await aiApi.POST(request("http://localhost/api/ai", {
      action: "chat",
      agentId: "research-01",
      message: "Uji penanganan kegagalan runtime.",
    }));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Provider sementara tidak tersedia.",
    });
  });

  it("rejects invalid office operations and malformed runtime requests", async () => {
    const invalidTask = await officeApi.POST(request("http://localhost/api/office", {
      action: "add-task",
      title: "",
      assigneeId: "unknown-agent",
    }));
    expect(invalidTask.status).toBe(400);

    const malformed = await aiApi.POST(new Request("http://localhost/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }));
    expect(malformed.status).toBe(400);
  });
});
