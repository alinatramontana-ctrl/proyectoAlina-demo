"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PisoKey = "AZOTEA" | "P3" | "P2" | "P1" | "PB";

export default function ExploradorPisos() {
  const router = useRouter();

  const pisos = useMemo(
    () =>
      [
        { key: "AZOTEA", label: "Azotea" },
        { key: "P3", label: "Tercer Piso" },
        { key: "P2", label: "Segundo Piso" },
        { key: "P1", label: "Primer Piso" },
        { key: "PB", label: "PB" },
      ] as const,
    []
  );

  const [pisoActivo, setPisoActivo] = useState<PisoKey>("PB");

  // ESC = volver al inicio
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.push("/");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const pisoLabel =
    pisos.find((p) => p.key === pisoActivo)?.label ?? "Planta";

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Botonera */}
      <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-xs uppercase tracking-[0.35em] text-zinc-400">
          Pisos
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {pisos.map((p) => {
            const active = p.key === pisoActivo;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setPisoActivo(p.key)}
                className={[
                  "w-full text-left rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.25em] transition",
                  active
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/15 bg-black/20 text-zinc-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-[11px] text-zinc-500">
          Tip: presioná <span className="text-zinc-300">ESC</span> para volver al inicio.
        </p>
      </aside>

      {/* Área central (por ahora placeholder) */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-400">
              Planta
            </div>
            <div className="mt-1 text-lg">{pisoLabel}</div>
          </div>

          <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            (en el próximo paso va el plano interactivo)
          </div>
        </div>

        <div className="p-6">
          <div className="aspect-[16/9] w-full rounded-2xl border border-white/10 bg-black/20 flex items-center justify-center text-zinc-400">
            Aquí va la imagen/plano del piso seleccionado
          </div>
        </div>
      </section>
    </div>
  );
}
