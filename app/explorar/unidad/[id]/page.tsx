"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { UNIDADES } from "@/lib/unidades";

function loadImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export default function GaleriaUnidadPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const unidadId = String(params?.id ?? "").toUpperCase();
  const from = searchParams.get("from"); // "unidades"
  const floor = searchParams.get("floor"); // "azotea" | "3" | "2" | "1" | "pb"

  const backHref =
    from === "unidades"
      ? "/unidades"
      : floor
      ? `/explorar?floor=${encodeURIComponent(floor)}`
      : "/explorar";

  const unidad = useMemo(() => {
    return UNIDADES.find((u) => String(u.id).toUpperCase() === unidadId) ?? null;
  }, [unidadId]);

  // Si no existe, volvemos a donde corresponda (no a azotea)
  useEffect(() => {
    if (!unidadId) return;
    if (!unidad) router.push(backHref);
  }, [unidad, unidadId, router, backHref]);

  // Generar lista REAL de imágenes existentes
  const [images, setImages] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIdx(0);
      const found: string[] = [];
      const base = `/renders-unidades/${unidadId}`;

      // probamos del 01 al 20 (ajustá si querés)
      for (let i = 1; i <= 20; i++) {
        const name = String(i).padStart(2, "0");
        const src = `${base}/${name}.jpg`;
        const ok = await loadImage(src);

        if (ok) {
          found.push(src);
        } else {
          // corte temprano: si ya encontró al menos 1 y el siguiente falla, asumimos que terminó
          if (found.length > 0) break;
        }
      }

      if (!cancelled) setImages(found);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [unidadId]);

  // Navegación teclado
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.push(backHref);
      if (e.key === "ArrowRight") setIdx((v) => Math.min(v + 1, images.length - 1));
      if (e.key === "ArrowLeft") setIdx((v) => Math.max(v - 1, 0));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, backHref, images.length]);

  if (!unidad) return null;

  const titulo = `${unidad.nombre} — ${unidad.tipo}`;
  const subtitulo = `${unidad.tipo} · ${unidad.frente ? "Frente" : "Contrafrente"} · ${unidad.m2} m²`;

  const current = images[idx];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400">Galería de renders</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-light tracking-tight">{titulo}</h1>
            <p className="mt-2 text-sm text-zinc-300">{subtitulo}</p>
          </div>

          {/* SOLO este botón (sin “Ver ficha”) y más chico */}
          <Link
            href={backHref}
            className="shrink-0 border border-white/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            Volver
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden relative">
          <div className="relative aspect-[16/9] w-full">
            {current ? (
              <img
                src={current}
                alt={`${unidad.nombre} render ${idx + 1}`}
                className="absolute inset-0 h-full w-full object-contain p-6"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                No hay imágenes cargadas para {unidadId} en /public/renders-unidades/{unidadId}/
              </div>
            )}

            {/* Flechas */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setIdx((v) => Math.max(v - 1, 0))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 border border-white/20 bg-black/40 w-10 h-10 rounded-full hover:bg-white hover:text-black transition"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setIdx((v) => Math.min(v + 1, images.length - 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 border border-white/20 bg-black/40 w-10 h-10 rounded-full hover:bg-white hover:text-black transition"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}

            {/* contador real */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest text-zinc-300 bg-black/40 border border-white/10 px-3 py-1 rounded-full">
              {images.length ? `${idx + 1} / ${images.length}` : "0 / 0"} — ← → para navegar · ESC para volver
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}