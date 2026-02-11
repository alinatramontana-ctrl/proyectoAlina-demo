import { Suspense } from "react";
import ExplorarClient from "./ExplorarClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-sm text-zinc-400">Cargando explorar…</p>
        </main>
      }
    >
      <ExplorarClient />
    </Suspense>
  );
}
