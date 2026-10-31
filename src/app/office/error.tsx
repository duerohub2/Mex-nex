"use client";

import { useEffect } from "react";

type OfficeErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OfficeError({ error, reset }: OfficeErrorProps) {
  useEffect(() => {
    console.error("[MEX-NEX Office Error]", error);
  }, [error]);

  return (
    <section
      role="alert"
      className="flex min-h-full w-full items-center justify-center bg-background px-6 py-10 text-foreground"
    >
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-destructive">
          Office gagal ditampilkan
        </p>
        <h1 className="mb-3 text-2xl font-bold">Terjadi kesalahan saat membuka kantor</h1>
        <p className="mb-5 text-sm text-muted-foreground">
          Halaman Office mengalami error saat dijalankan. Coba muat ulang bagian ini.
          Jika masalah berulang, kirimkan kode error di bawah kepada tim pengembang.
        </p>
        {error.digest ? (
          <p className="mb-4 break-all rounded-lg bg-muted p-3 font-mono text-xs">
            Kode error: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Coba lagi
        </button>
      </div>
    </section>
  );
}
