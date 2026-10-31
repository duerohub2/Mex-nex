"use client";

import dynamic from "next/dynamic";
import { AgentStoreProvider } from "@/features/agents/state/store";

const OfficeScreen = dynamic(
  () => import("@/features/office/screens/OfficeScreen").then((module) => module.OfficeScreen),
  {
    ssr: false,
    loading: () => (
      <main className="flex min-h-screen w-full items-center justify-center bg-black text-white">
        <div className="rounded-xl border border-white/15 bg-white/5 px-6 py-5 text-center">
          <p className="text-sm font-semibold">MEX-NEX Office</p>
          <p className="mt-2 text-xs text-white/60">Menyiapkan ruang kantor…</p>
        </div>
      </main>
    ),
  },
);

export default function OfficeClient() {
  return (
    <AgentStoreProvider>
      <OfficeScreen showHermesConsole={false} />
    </AgentStoreProvider>
  );
}
