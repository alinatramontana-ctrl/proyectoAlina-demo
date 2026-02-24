"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { UNIDADES } from "@/lib/unidades";

function loadImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function EstadoPill({ estado }: { estado: string }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-widest border";

  if (estado === "Disponible") {
    return (
      <span
        className={`${base} border-emerald-300/60 bg-emerald-500/10 text-emerald-600`}
      >
        Disponible
      </span>
    );
  }
  if (estado === "Reservado") {
    return (
      <span
        className={`${base} border-amber-300/60 bg-amber-500/10 text-amber-700`}
      >
        Reservado
      </span>
    );
  }
  return (
    <span className={`${base} border-rose-300/60 bg-rose-500/10 text-rose-700`}>
      Vendido
    </span>
  );
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

  // Si no existe, volvemos a donde corresponda
  useEffect(() => {
    if (!unidadId) return;
    if (!unidad) router.push(backHref);
  }, [unidad, unidadId, router, backHref]);

  // Lista REAL de imágenes existentes
  const [images, setImages] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  // loading para evitar flashes
  const [loading, setLoading] = useState(true);

  // Evitar race conditions
  const runIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const myRunId = ++runIdRef.current;

    async function run() {
      setLoading(true);
      setIdx(0);
      setImages([]);

      const found: string[] = [];
      const base = `/renders-unidades/${unidadId}`;

      const max = 20;
      const batchSize = 4;

      for (let start = 1; start <= max; start += batchSize) {
        const batch: { i: number; src: string }[] = [];
        for (let i = start; i < start + batchSize && i <= max; i++) {
          const name = String(i).padStart(2, "0");
          const src = `${base}/${name}.jpg`;
          batch.push({ i, src });
        }

        const results = await Promise.all(batch.map((b) => loadImage(b.src)));

        let anyOk = false;
        for (let j = 0; j < batch.length; j++) {
          if (results[j]) {
            anyOk = true;
            found.push(batch[j].src);
          }
        }

        if (!anyOk && found.length > 0) break;
        if (cancelled || runIdRef.current !== myRunId) return;
      }

      if (!cancelled && runIdRef.current === myRunId) {
        setImages(found);
        setLoading(false);
      }
    }

    if (unidadId) run();

    return () => {
      cancelled = true;
    };
  }, [unidadId]);

  // Navegación teclado (solo desktop/pc lo va a usar)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.push(backHref);

      if (e.key === "ArrowRight" && images.length > 0) {
        setIdx((v) => Math.min(v + 1, images.length - 1));
      }
      if (e.key === "ArrowLeft" && images.length > 0) {
        setIdx((v) => Math.max(v - 1, 0));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, backHref, images.length]);

  // Menú
  const [menuOpen, setMenuOpen] = useState(false);

  if (!unidad) return null;

  const subtitulo = `${unidad.tipo} · ${
    unidad.frente ? "Frente" : "Contrafrente"
  } · ${unidad.m2} m²`;

  const current = images[idx];

  const tourHref = floor
    ? `/tour/${encodeURIComponent(
        unidad.id
      )}?from=explorar&floor=${encodeURIComponent(floor)}`
    : `/tour/${encodeURIComponent(unidad.id)}?from=explorar`;

  const consultarHref = `/contacto?unidad=${encodeURIComponent(unidad.nombre)}`;

  const coverSrc = `/renders-unidades/${unidadId}/cover.jpg`;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#e9f0f3]">
      {/* ✅ Mobile: columna / Desktop: fila */}
      <div className="relative h-full w-full flex flex-col lg:flex-row">
        {/* SIDEBAR (en mobile ocupa todo el ancho) */}
        <aside className="relative z-30 w-full lg:w-[360px] shrink-0 bg-white text-slate-900 border-r border-black/10">
          {/* Botonera arriba izquierda */}
          <div className="absolute left-4 top-4 z-40 flex items-center gap-3">
            {/* MENU */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-11 w-11 rounded-full bg-emerald-200/70 text-slate-900 shadow-sm border border-black/10 hover:bg-emerald-200 transition flex items-center justify-center"
              aria-label="Menú"
              title="Menú"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* VOLVER */}
            <button
              type="button"
              onClick={() => router.push(backHref)}
              className="h-11 w-11 rounded-full bg-white/80 text-slate-900 shadow-sm border border-black/10 hover:bg-white transition flex items-center justify-center"
              aria-label="Volver"
              title="Volver"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* CARD MENÚ desplegable */}
          {menuOpen && (
            <div className="absolute left-4 top-[72px] z-40 w-[300px] rounded-[26px] bg-[#EAEAEA] text-[#183e4b] shadow-xl overflow-hidden">
              <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#183e4b]/70">
                    Menú
                  </p>
                  <p className="mt-1 text-lg leading-tight font-semibold">
                    Edificio Innovate
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-black/10 px-3 py-1 text-[11px] uppercase tracking-widest hover:bg-black/15 transition"
                >
                  Cerrar
                </button>
              </div>

              <div className="px-5 pb-5 flex flex-col gap-3">
                <Link
                  href="/explorar"
                  className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Explorar edificio
                </Link>
                <Link
                  href="/unidades"
                  className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Ver unidades
                </Link>
                <Link
                  href="/ubicacion"
                  className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Ubicación
                </Link>
                <Link
                  href="/contacto"
                  className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Contacto
                </Link>

                <p className="mt-1 text-[11px] text-[#183e4b]/70">
                  Tip: presioná <span className="font-semibold">ESC</span> para
                  volver a la planta.
                </p>
              </div>
            </div>
          )}

          {/* CONTENIDO */}
          <div className="h-full overflow-y-auto px-6 pt-24 pb-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-500">
                  Unidad
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight">
                  {unidad.nombre}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>
              </div>

              <button
                type="button"
                onClick={() => router.push(backHref)}
                className="h-10 w-10 rounded-full border border-black/10 bg-white hover:bg-slate-50 transition flex items-center justify-center"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <EstadoPill estado={unidad.estado} />
            </div>

            {/* COVER */}
            <div className="mt-5">
              <div className="rounded-2xl border border-black/10 bg-slate-50 overflow-hidden">
                <div className="relative w-full aspect-[16/9]">
                  <img
                    src={coverSrc}
                    alt={`Imagen de ${unidad.nombre}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const placeholder =
                        document.getElementById("cover-placeholder");
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />

                  <div
                    id="cover-placeholder"
                    className="absolute inset-0 hidden items-center justify-center text-slate-400 text-sm"
                  >
                    (Sin imagen de portada)
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-6 border-black/10" />

            <p className="text-[11px] uppercase tracking-widest text-slate-500">
              Especificaciones
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  ID
                </p>
                <p className="mt-1 text-sm font-medium">{unidad.id}</p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Planta
                </p>
                <p className="mt-1 text-sm font-medium">{unidad.planta}</p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Superficie
                </p>
                <p className="mt-1 text-sm font-medium">{unidad.m2} m²</p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Baños
                </p>
                <p className="mt-1 text-sm font-medium">{unidad.banos}</p>
              </div>
            </div>

            {/* BOTONES */}
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={consultarHref}
                className="rounded-full bg-[#183e4b] text-white text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
              >
                Consultar precio
              </Link>

              <Link
                href={tourHref}
                className="rounded-full bg-[#8ba0a4] text-white text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
              >
                Tour 360
              </Link>
            </div>

            <p className="mt-6 text-[11px] text-slate-400">
              Tip: usá <span className="font-semibold">← →</span> para navegar
              imágenes · <span className="font-semibold">ESC</span> para volver a
              la planta.
            </p>
          </div>
        </aside>

        {/* GALERÍA */}
        <section className="relative w-full lg:flex-1">
          {/* ✅ Desktop mantiene fullscreen del panel derecho */}
          <div className="hidden lg:block absolute inset-0 bg-[#e9f0f3]" />

          {/* ✅ Desktop (igual que antes) */}
          <div className="hidden lg:flex absolute inset-0 items-center justify-center">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-[70%] max-w-[900px]">
                  <div className="aspect-[16/9] rounded-2xl bg-white/60 border border-black/10 shadow-sm animate-pulse" />
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-black/15" />
                    <span className="h-2 w-2 rounded-full bg-black/10" />
                    <span className="h-2 w-2 rounded-full bg-black/10" />
                  </div>
                  <p className="mt-4 text-center text-slate-500 text-sm">
                    Cargando renders…
                  </p>
                </div>
              </div>
            ) : current ? (
              <img
                src={current}
                alt={`${unidad.nombre} render ${idx + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-slate-500 px-8 text-center">
                No hay imágenes cargadas para {unidadId} en{" "}
                <span className="font-semibold">
                  /public/renders-unidades/{unidadId}/
                </span>
              </div>
            )}
          </div>

          {/* Flechas (solo desktop) */}
          {images.length > 1 && !loading && (
            <>
              <button
                type="button"
                onClick={() => setIdx((v) => Math.max(v - 1, 0))}
                className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 border border-black/10 bg-white/70 text-slate-900 w-11 h-11 rounded-full hover:bg-white transition z-20 items-center justify-center"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setIdx((v) => Math.min(v + 1, images.length - 1))}
                className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 border border-black/10 bg-white/70 text-slate-900 w-11 h-11 rounded-full hover:bg-white transition z-20 items-center justify-center"
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}

          {/* Contador (solo desktop) */}
          <div className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest text-slate-700 bg-white/70 border border-black/10 px-3 py-1 rounded-full z-20">
            {loading
              ? "Cargando…"
              : images.length
              ? `${idx + 1} / ${images.length}`
              : "0 / 0"}{" "}
            — ← → para navegar · ESC para volver
          </div>

          {/* ✅ MOBILE: galería abajo de la card */}
          <div className="lg:hidden w-full border-t border-black/10 bg-[#e9f0f3]">
            <div className="px-4 py-4">
              {loading ? (
                <div className="w-full">
                  <div className="aspect-[16/9] rounded-2xl bg-white/60 border border-black/10 shadow-sm animate-pulse" />
                  <p className="mt-3 text-center text-slate-500 text-sm">
                    Cargando renders…
                  </p>
                </div>
              ) : current ? (
                <>
                  {/* Imagen principal */}
                  <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
                    <div className="relative w-full aspect-[16/9]">
                      <img
  src={current}
  alt={`${unidad.nombre} render ${idx + 1}`}
  className="absolute inset-0 h-full w-full object-contain bg-white"
/>
                    </div>
                  </div>

                  {/* Miniaturas (scroll horizontal) */}
                  {images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                      {images.map((src, i) => {
                        const active = i === idx;
                        return (
                          <button
                            key={src}
                            type="button"
                            onClick={() => setIdx(i)}
                            className={[
                              "shrink-0 rounded-xl overflow-hidden border transition",
                              active
                                ? "border-[#183e4b] shadow-sm"
                                : "border-black/10 opacity-80",
                            ].join(" ")}
                            aria-label={`Ver render ${i + 1}`}
                            title={`Render ${i + 1}`}
                          >
                            <div className="w-[80px] aspect-[4/3] bg-white">
                              <img
                                src={src}
                                alt={`Miniatura ${i + 1}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Contador mobile */}
                  <p className="mt-2 text-center text-[11px] uppercase tracking-widest text-slate-600">
                    {images.length ? `${idx + 1} / ${images.length}` : "0 / 0"}
                  </p>
                </>
              ) : (
                <div className="text-slate-500 px-4 text-center">
                  No hay imágenes cargadas para {unidadId} en{" "}
                  <span className="font-semibold">
                    /public/renders-unidades/{unidadId}/
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}