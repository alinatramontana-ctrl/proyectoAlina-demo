"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function GaleriaEdificio() {
  const router = useRouter();

  const images = useMemo(
    () => [
      "/galeria-edificio/01.jpg",
      "/galeria-edificio/02.jpg",
      "/galeria-edificio/03.jpg",
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

  // ✅ Teclado: ← → y ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Evita que el navegador haga scroll con flechas
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.preventDefault();

      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();

      // ESC: volver al inicio
      if (e.key === "Escape") router.push("/");
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, images.length]);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        {/* Imagen */}
        <div className="relative aspect-[16/9] w-full">
          <img
            src={images[idx]}
            alt={`Render edificio ${idx + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Degradé sutil */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        </div>

        {/* Flechas */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-sm hover:bg-white hover:text-black transition"
          aria-label="Anterior"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-sm hover:bg-white hover:text-black transition"
          aria-label="Siguiente"
        >
          ›
        </button>

        {/* Indicador */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200">
          {idx + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
