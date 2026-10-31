"use client";

import React, { Component, useEffect, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AgentStoreProvider } from "@/features/agents/state/store";

type OfficeScreenComponent = typeof import("@/features/office/screens/OfficeScreen").OfficeScreen;

class OfficeRenderBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[MEX-NEX Office] Error saat merender OfficeScreen:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen w-full items-center justify-center bg-black px-6 text-white">
          <section className="w-full max-w-xl rounded-xl border border-red-400/30 bg-white/5 p-6">
            <h1 className="text-lg font-semibold">Kantor mengalami error</h1>
            <p className="mt-2 text-sm text-white/70">
              Modul Office berhasil dimuat, tetapi gagal ditampilkan.
            </p>
            <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/40 p-3 text-xs text-red-200">
              {this.state.error.name}: {this.state.error.message}
              {"\n"}
              {this.state.error.stack ?? ""}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Muat ulang
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function OfficeClient() {
  const [OfficeScreen, setOfficeScreen] = useState<OfficeScreenComponent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let active = true;
    const timeoutId = window.setTimeout(() => {
      if (active) setTimedOut(true);
    }, 20000);

    import("@/features/office/screens/OfficeScreen")
      .then((module) => {
        if (active) setOfficeScreen(() => module.OfficeScreen);
      })
      .catch((error: unknown) => {
        console.error("[MEX-NEX Office] Gagal memuat OfficeScreen:", error);
        if (active) {
          setLoadError(
            error instanceof Error
              ? `${error.name}: ${error.message}`
              : String(error),
          );
        }
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (loadError || timedOut) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-black px-6 text-white">
        <section className="w-full max-w-xl rounded-xl border border-red-400/30 bg-white/5 p-6">
          <h1 className="text-lg font-semibold">Office belum berhasil dimuat</h1>
          <p className="mt-2 text-sm text-white/70">
            {loadError
              ? "Browser gagal memuat modul OfficeScreen."
              : "Pemuatan modul OfficeScreen melebihi 20 detik."}
          </p>
          {loadError ? (
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-black/40 p-3 text-xs text-red-200">
              {loadError}
            </pre>
          ) : null}
          <p className="mt-3 text-xs text-white/50">
            Muat ulang halaman. Jika masalah berlanjut, kirimkan tangkapan layar pesan ini.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
          >
            Muat ulang
          </button>
        </section>
      </main>
    );
  }

  if (!OfficeScreen) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-black text-white">
        <div className="rounded-xl border border-white/15 bg-white/5 px-6 py-5 text-center">
          <p className="text-sm font-semibold">MEX-NEX Office</p>
          <p className="mt-2 text-xs text-white/60">Sedang menyiapkan kantor…</p>
        </div>
      </main>
    );
  }

  return (
    <AgentStoreProvider>
      <OfficeRenderBoundary>
        <OfficeScreen showHermesConsole={false} />
      </OfficeRenderBoundary>
    </AgentStoreProvider>
  );
}
