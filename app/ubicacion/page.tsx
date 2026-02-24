"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopLeftMenu from "@/app/components/TopLeftMenu";

type Slide =
  | { kind: "map"; embedUrl: string; openUrl: string }
  | { kind: "image"; src: string; alt: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function UbicacionPage() {
  const router = useRouter();

  // ✅ Imágenes (en /public/ubicacion/)
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

  // ✅ Mapa (demo). Ideal: reemplazar por embed real "pb=..."
  const mapsEmbed =
    "https://www.google.com/maps?q=-32.944242,-60.650539&z=16&output=embed";
  const mapsOpen = "https://www.google.com/maps?q=-32.944242,-60.650539&z=16";

  // Premium: mapa como primer slide + renders
  const slides: Slide[] = useMemo(
    () => [
      { kind: "map", embedUrl: mapsEmbed, openUrl: mapsOpen },
      ...images.map((src, i) => ({
  kind: "image" as const,
  src,
  alt: `Render exterior ${i + 1}`,
}))
    ],
    [images]
  );

  const [idx, setIdx] = useState(0);
  const total = slides.length;

  const go = (n: number) => setIdx((cur) => clamp(n, 0, total - 1));
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  // ✅ ESC vuelve + ← →
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, idx, total]);

  const current = slides[idx];

  return (
    <main className="relative min-h-screen bg-[#EAEAEA] text-slate-900 overflow-hidden">
      {/* ✅ Igual que Contacto */}
      <TopLeftMenu backHref="/" />

      {/* ✅ Fondo full: mapa “ambiental” (suave) */}
      <div className="pointer-events-none absolute inset-0">
        <iframe
          title="Fondo"
          src={mapsEmbed}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Soft treatment: blur + desaturación + velo */}
        <div className="absolute inset-0 backdrop-blur-[3px] saturate-50 opacity-80" />
        <div className="absolute inset-0 bg-[#EAEAEA]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/5" />
      </div>

      {/* ✅ Contenido centrado premium */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl">
          {/* Título centrado (mismo estilo que Contacto) */}
          <h1 className="text-center text-5xl tracking-tight text-[#183e4b]">
            Ubicación
          </h1>

          <p className="mt-3 text-center text-slate-600">
            
          </p>

          {/* Card principal estilo “Contacto” */}
          <div className="mt-10 rounded-[26px] bg-[#EAEAEA] p-6 shadow-xl border border-black/10">
            {/* Inner card (viewer) */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-black/10">
              {/* Viewer */}
              <div className="relative aspect-[16/9] w-full bg-neutral-100">
                {current.kind === "map" ? (
                  <>
                    <iframe
                      title="Mapa"
                      src={current.embedUrl}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                    <a
                      href={current.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-[11px] uppercase tracking-widest text-[#183e4b] border border-black/10 shadow-sm backdrop-blur hover:bg-white transition"
                    >
                      Abrir en Google Maps
                    </a>
                  </>
                ) : (
                  <img
                    src={current.src}
                    alt={current.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                )}

                {/* Flechas premium (sutiles) */}
                {total > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      disabled={idx === 0}
                      aria-label="Anterior"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 w-11 h-11 border border-black/10 shadow-sm backdrop-blur hover:bg-white transition disabled:opacity-40"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      disabled={idx === total - 1}
                      aria-label="Siguiente"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 w-11 h-11 border border-black/10 shadow-sm backdrop-blur hover:bg-white transition disabled:opacity-40"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Contador */}
                <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] uppercase tracking-widest text-[#183e4b] border border-black/10 shadow-sm backdrop-blur">
                  {idx + 1} / {total}
                </div>
              </div>

              {/* Footer fino (como Contacto) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-5 py-4">
                <p className="text-[11px] text-[#183e4b]/70">
                  Tip: usá <span className="font-semibold">← →</span> para
                  cambiar · <span className="font-semibold">ESC</span> vuelve al
                  inicio
                </p>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Ir a slide ${i + 1}`}
                      onClick={() => go(i)}
                      className={[
                        "h-2.5 w-2.5 rounded-full transition border border-black/10",
                        i === idx
                          ? "bg-[#183e4b]"
                          : "bg-[#8ba0a4]/40 hover:bg-[#8ba0a4]/60",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Botonera opcional (si querés sumar un CTA) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href={mapsOpen}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#8ba0a4] text-white text-[11px] uppercase tracking-widest px-6 py-3 text-center hover:opacity-90 transition"
              >
                Ver en Maps
              </a>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-full bg-[#183e4b] text-white text-[11px] uppercase tracking-widest px-6 py-3 text-center hover:opacity-90 transition"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}