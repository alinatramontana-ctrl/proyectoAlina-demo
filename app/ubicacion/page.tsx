"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function UbicacionPage() {
  const router = useRouter();

  // ✅ Galería (poné tus renders en /public/ubicacion/01.jpg, 02.jpg, 03.jpg...)
  const images = useMemo(
    () => [
      "/ubicacion/01.jpg",
      "/ubicacion/02.jpg",
      "/ubicacion/03.jpg",
      "/ubicacion/04.jpg",
      "/ubicacion/05.jpg",

    ],
    []
  );

  const [idx, setIdx] = useState(0);

  function prev() {
    setIdx((v) => (v - 1 + images.length) % images.length);
  }
  function next() {
    setIdx((v) => (v + 1) % images.length);
  }

  // ✅ ESC vuelve al inicio + flechas teclado para galería
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, images.length]);

  // ✅ DEMO: poné acá una dirección real después
  const mapsUrl =
    "https://www.google.com/maps?q=-32.944242,-60.650539&z=16&output=embed"; // Rosario (demo)
  const mapsOpen =
    "https://www.google.com/maps?q=-32.944242,-60.650539&z=16"; // link normal

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Ubicación
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-light tracking-tight">
              Entorno y accesos
            </h1>
            <p className="mt-2 text-sm text-zinc-300">
              Demo: mapa + renders exteriores. (ESC vuelve al inicio)
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="border border-white/30 bg-black/30 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            Volver
          </button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* MAPA */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="p-5 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Mapa
              </p>

              <a
                href={mapsOpen}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
              >
                Abrir en Google Maps
              </a>
            </div>

            <div className="relative aspect-[16/10] w-full">
              <iframe
                title="Mapa"
                src={mapsUrl}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-0 border-t border-white/10" />
            </div>
          </div>

          {/* GALERÍA EXTERIORES */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="p-5 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Renders exteriores
              </p>
              <div className="text-[11px] uppercase tracking-widest text-zinc-300 border border-white/10 bg-black/30 px-3 py-1 rounded-full">
                {idx + 1} / {images.length}
              </div>
            </div>

            <div className="relative aspect-[16/10] w-full">
              <img
                src={images[idx]}
                alt={`Render exterior ${idx + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Flechas */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 border border-white/20 bg-black/40 w-10 h-10 rounded-full hover:bg-white hover:text-black transition"
                    aria-label="Anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 border border-white/20 bg-black/40 w-10 h-10 rounded-full hover:bg-white hover:text-black transition"
                    aria-label="Siguiente"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Degradé sutil */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
            </div>

            <div className="p-5 text-xs text-zinc-500">
              Tip: usá las flechas del teclado <span className="text-zinc-300">← →</span> para cambiar imágenes.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
