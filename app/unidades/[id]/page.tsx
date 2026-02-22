"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { UNIDADES } from "@/lib/unidades";
import EscapeToHome from "../../components/EscapeToHome";

function EstadoBadge({ estado }: { estado: string }) {
  const base =
    "text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border";

  if (estado === "Disponible") {
    return (
      <span
        className={`${base} border-emerald-300/50 text-emerald-200 bg-emerald-500/10`}
      >
        {estado}
      </span>
    );
  }
  if (estado === "Reservado") {
    return (
      <span
        className={`${base} border-amber-300/50 text-amber-200 bg-amber-500/10`}
      >
        {estado}
      </span>
    );
  }
  return (
    <span className={`${base} border-rose-300/50 text-rose-200 bg-rose-500/10`}>
      {estado}
    </span>
  );
}

export default function UnidadDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = String(params?.id ?? "").toLowerCase();

  const unidad = useMemo(
    () => UNIDADES.find((u) => String(u.id).toLowerCase() === id),
    [id]
  );

  // Si no existe, mostramos una 404 simple (en client no usamos notFound()).
  if (!unidad) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-sm text-zinc-400">Unidad no encontrada.</p>
          <Link
            href="/unidades"
            className="inline-block mt-4 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            Volver a Unidades
          </Link>
        </div>
      </main>
    );
  }

  const frenteTxt = unidad.frente ? "Frente" : "Contrafrente";

  /**
   * 🔧 IMÁGENES DE LA GALERÍA
   * Reemplazá este array por tus rutas reales.
   * Ejemplos:
   *  - `/renders/${unidad.id}/01.jpg`
   *  - `/unidades/${unidad.id}/01.jpg`
   *  - o si tenés un campo unidad.imagenes, usás eso.
   */
  const IMAGES = useMemo(() => {
    // EJEMPLO: 4 imágenes por unidad
    return [
      `/renders/${unidad.id}/01.jpg`,
      `/renders/${unidad.id}/02.jpg`,
      `/renders/${unidad.id}/03.jpg`,
      `/renders/${unidad.id}/04.jpg`,
    ];
  }, [unidad.id]);

  const [panelOpen, setPanelOpen] = useState(true);
  const [idx, setIdx] = useState(0);

  function prev() {
    setIdx((v) => (v - 1 + IMAGES.length) % IMAGES.length);
  }
  function next() {
    setIdx((v) => (v + 1) % IMAGES.length);
  }

  // Teclado: ESC a home, flechas para galería
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.push("/");
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IMAGES.length, router]);

  return (
    <main className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* ✅ ESC => vuelve al inicio */}
      <EscapeToHome />

      {/* ====== GALERÍA FULLSCREEN ====== */}
      <div className="absolute inset-0">
        {/* Imagen actual */}
        <img
          src={IMAGES[idx]}
          alt={`${unidad.nombre} - imagen ${idx + 1}`}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />

        {/* overlay suave opcional (por si querés más lectura del UI) */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Flecha izquierda */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full border border-white/20 bg-black/35 backdrop-blur flex items-center justify-center hover:bg-black/55 transition"
          aria-label="Anterior"
          title="Anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Flecha derecha */}
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full border border-white/20 bg-black/35 backdrop-blur flex items-center justify-center hover:bg-black/55 transition"
          aria-label="Siguiente"
          title="Siguiente"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Contador abajo */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 rounded-full border border-white/15 bg-black/35 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-widest text-white/85">
          {idx + 1} / {IMAGES.length} · ← → para navegar · ESC para volver al inicio
        </div>
      </div>

      {/* ====== TOP LEFT: menú + volver ====== */}
      <div className="absolute left-6 top-6 z-50 flex items-center gap-3">
        {/* Menú (abre/cierra panel) */}
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          className="h-11 w-11 rounded-full border border-white/25 bg-black/35 backdrop-blur flex items-center justify-center hover:bg-black/50 transition"
          aria-label="Menú"
          title="Menú"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Volver al inicio */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="h-11 w-11 rounded-full border border-white/25 bg-black/35 backdrop-blur flex items-center justify-center hover:bg-black/50 transition"
          aria-label="Volver al inicio"
          title="Volver"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ====== PANEL LATERAL (ocultable) ====== */}
      <aside
        className={[
          "absolute left-0 top-0 z-40 h-full w-[360px] max-w-[90vw] bg-white text-[#183e4b] shadow-2xl transition-transform",
          panelOpen ? "translate-x-0" : "-translate-x-[105%]",
        ].join(" ")}
      >
        {/* Header panel */}
        <div className="p-5 border-b border-black/10 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#183e4b]/70">
              Galería de renders
            </p>
            <h1 className="mt-1 text-2xl leading-tight font-semibold">
              {unidad.nombre}
            </h1>

            <p className="mt-2 text-sm text-[#183e4b]/80">
              {unidad.planta} · {unidad.tipo} · {frenteTxt} · {unidad.m2} m²
            </p>

            <div className="mt-3 flex items-center gap-3">
              <EstadoBadge estado={unidad.estado} />
              <div className="text-sm">
                <span className="text-[#183e4b]/60 text-xs uppercase tracking-widest">
                  Precio
                </span>
                <div className="font-semibold">{unidad.precio}</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="h-10 w-10 rounded-full border border-black/10 bg-black/5 flex items-center justify-center hover:bg-black/10 transition"
            aria-label="Cerrar"
            title="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#183e4b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Contenido panel (por ahora placeholder, después metemos tus specs reales) */}
        <div className="p-5 overflow-auto h-[calc(100%-92px)]">
          <p className="text-xs uppercase tracking-widest text-[#183e4b]/60">
            Especificaciones
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-[11px] uppercase tracking-widest text-[#183e4b]/60">
                Área construida
              </div>
              <div className="mt-1 font-semibold">{unidad.m2} m²</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-[11px] uppercase tracking-widest text-[#183e4b]/60">
                Baños
              </div>
              <div className="mt-1 font-semibold">{unidad.banos}</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-[11px] uppercase tracking-widest text-[#183e4b]/60">
                Orientación
              </div>
              <div className="mt-1 font-semibold">{frenteTxt}</div>
            </div>
          </div>

          {/* Botonera inferior (podés cambiarla luego) */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/tour/${unidad.id}`}
              className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest px-5 py-3 text-center hover:opacity-90 transition"
            >
              Tour 360°
            </Link>

            <Link
              href="/unidades"
              className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest px-5 py-3 text-center hover:opacity-90 transition"
            >
              Volver a Unidades
            </Link>
          </div>

          <p className="mt-6 text-[11px] text-[#183e4b]/70">
            Tip: podés ocultar este panel con el botón de menú.
          </p>
        </div>
      </aside>

      {/* Fondo oscuro cuando el panel está abierto (solo para mobile/UX) */}
      {panelOpen && (
        <button
          type="button"
          onClick={() => setPanelOpen(false)}
          className="absolute inset-0 z-30 bg-black/20 md:hidden"
          aria-label="Cerrar panel"
        />
      )}
    </main>
  );
}