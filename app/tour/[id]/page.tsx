"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { UNIDADES } from "@/lib/unidades";

type SceneId = "s1" | "s2" | "s3";
type UnitId = "1A" | "1B" | "2A" | "2B" | "3A" | "3B";

type HS = { pitch: number; yaw: number; to: SceneId };
type UnitHotspots = Record<SceneId, HS[]>;

const HOTSPOTS_BY_UNIT: Partial<Record<UnitId, UnitHotspots>> = {
  "1A": {
    s1: [
      { pitch: -27.95, yaw: -93.46, to: "s2" },
      { pitch: -33.38, yaw: -59.0, to: "s3" },
    ],
    s2: [
      { pitch: -39.24, yaw: -91.35, to: "s1" },
      { pitch: -51.86, yaw: 158.65, to: "s3" },
    ],
    s3: [{ pitch: -23.53, yaw: -146.56, to: "s1" }],
  },
  "1B": {
    s1: [
      { pitch: -34, yaw: 85, to: "s2" },
      { pitch: -34, yaw: 55.0, to: "s3" },
    ],
    s2: [
      { pitch: -34, yaw: 150, to: "s1" },
      { pitch: -50, yaw: -148, to: "s3" },
    ],
    s3: [{ pitch: -24, yaw: -139, to: "s1" }],
  },
  "2A": {
    s1: [
      { pitch: -26, yaw: 26, to: "s2" },
      { pitch: -43, yaw: -89, to: "s3" },
    ],
    s2: [{ pitch: -48, yaw: -159, to: "s1" }],
    s3: [{ pitch: -55, yaw: -132, to: "s1" }],
  },
  "2B": {
    s1: [
      { pitch: -24.67, yaw: 102, to: "s2" },
      { pitch: -36, yaw: 86, to: "s3" },
    ],
    s2: [{ pitch: -63, yaw: -144, to: "s1" }],
    s3: [{ pitch: -51, yaw: -52, to: "s1" }],
  },
  "3A": {
    s1: [
      { pitch: -26, yaw: 26, to: "s2" },
      { pitch: -43, yaw: -89, to: "s3" },
    ],
    s2: [{ pitch: -48, yaw: -159, to: "s1" }],
    s3: [{ pitch: -55, yaw: -132, to: "s1" }],
  },
  "3B": {
    s1: [
      { pitch: -24.67, yaw: 102, to: "s2" },
      { pitch: -36, yaw: 86, to: "s3" },
    ],
    s2: [{ pitch: -63, yaw: -144, to: "s1" }],
    s3: [{ pitch: -51, yaw: -52, to: "s1" }],
  },
};

function EstadoPill({ estado }: { estado: string }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-widest border";
  if (estado === "Disponible") {
    return (
      <span className={`${base} border-emerald-300/60 bg-emerald-500/10 text-emerald-600`}>
        Disponible
      </span>
    );
  }
  if (estado === "Reservado") {
    return (
      <span className={`${base} border-amber-300/60 bg-amber-500/10 text-amber-700`}>
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

function hotspotDot(hotSpotDiv: HTMLDivElement) {
  hotSpotDiv.classList.add("hs-dot");
  hotSpotDiv.innerHTML = "";
}

function sceneFromParam(pano: string | null): SceneId | null {
  if (!pano) return null;
  const p = pano.toLowerCase();
  if (p === "s1" || p === "1" || p === "01") return "s1";
  if (p === "s2" || p === "2" || p === "02") return "s2";
  if (p === "s3" || p === "3" || p === "03") return "s3";
  return null;
}

function preload(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

export default function TourPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const id = String(params?.id ?? "").toUpperCase();
  const unitId = id as UnitId;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const panoParam = searchParams.get("pano");

  const unidad = useMemo(() => {
    return UNIDADES.find((u) => String(u.id).toUpperCase() === id) ?? null;
  }, [id]);

  const scenes = useMemo(() => {
    const base = `/panos/${encodeURIComponent(id)}`;
    return {
      s1: `${base}/01.webp`,
      s2: `${base}/02.webp`,
      s3: `${base}/03.webp`,
    } as const;
  }, [id]);

  // thumbs livianos (con fallback al pano full si falta el archivo)
  const thumbs = useMemo(() => {
    const base = `/panos/${encodeURIComponent(id)}/thumbs`;
    return {
      s1: `${base}/01.jpg`,
      s2: `${base}/02.jpg`,
      s3: `${base}/03.jpg`,
      _fallback1: scenes.s1,
      _fallback2: scenes.s2,
      _fallback3: scenes.s3,
    };
  }, [id, scenes]);

  const backHref = useMemo(() => {
    const from = searchParams.get("from");
    const floor = searchParams.get("floor");
    if (from === "explorar" && floor) return `/explorar?floor=${encodeURIComponent(floor)}`;
    if (from === "unidades") return "/unidades";
    return "";
  }, [searchParams]);

  const onBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backHref]);

  // ✅ Preload mínimo: SOLO la inicial (prioriza time-to-first-view)
  useEffect(() => {
    preload(scenes.s1);
  }, [scenes]);

  // ✅ INIT Pannellum (no reinit por searchParams entero)
  useEffect(() => {
    if (!containerRef.current) return;

    const pannellum = (window as any).pannellum;
    if (!pannellum?.viewer) return;

    try {
      viewerRef.current?.destroy?.();
    } catch {}
    viewerRef.current = null;

    const unitHotspots = HOTSPOTS_BY_UNIT[unitId];

    const fallback: UnitHotspots = {
      s1: [{ pitch: -10, yaw: 30, to: "s2" }],
      s2: [
        { pitch: -10, yaw: -150, to: "s1" },
        { pitch: -10, yaw: 40, to: "s3" },
      ],
      s3: [{ pitch: -10, yaw: -120, to: "s2" }],
    };

    const active = unitHotspots ?? fallback;

    const toHotSpots = (arr: HS[]) =>
      arr.map((h) => ({
        pitch: h.pitch,
        yaw: h.yaw,
        type: "custom",
        cssClass: "hs-dot",
        createTooltipFunc: hotspotDot,
        clickHandlerFunc: () => {
          // ✅ Preload de la escena destino antes del salto
          preload(scenes[h.to]);
          viewerRef.current?.loadScene?.(h.to);
        },
      }));

    const startScene = sceneFromParam(panoParam) ?? "s1";

    const cfg = {
      default: {
        firstScene: startScene,
        autoLoad: true,
        showControls: true,
        compass: false,
        sceneFadeDuration: 900,
        hotSpotDebug: true,
      },
      scenes: {
        s1: { type: "equirectangular", panorama: scenes.s1, hotSpots: toHotSpots(active.s1) },
        s2: { type: "equirectangular", panorama: scenes.s2, hotSpots: toHotSpots(active.s2) },
        s3: { type: "equirectangular", panorama: scenes.s3, hotSpots: toHotSpots(active.s3) },
      },
    };

    setReady(false);
    viewerRef.current = pannellum.viewer(containerRef.current, cfg);

    // ✅ Cuando terminó de cargar la escena actual:
    // 1) marcamos ready
    // 2) precargamos las otras en background (progresivo)
    try {
      viewerRef.current?.on?.("load", () => {
        setReady(true);

        // Background preload (después de tener imagen en pantalla)
        // Si estás en s1, precargamos s2 y s3; si estás en s2, precargamos s1 y s3, etc.
        preload(scenes.s1);
        preload(scenes.s2);
        preload(scenes.s3);
      });
    } catch {
      setReady(true);
      preload(scenes.s2);
      preload(scenes.s3);
    }

    return () => {
      try {
        viewerRef.current?.destroy?.();
      } catch {}
      viewerRef.current = null;
      setReady(false);
    };
  }, [scenes, unitId, panoParam]);

  // ✅ Cambio por query param sin reiniciar el viewer
  useEffect(() => {
    const target = sceneFromParam(panoParam);
    if (!target) return;
    if (!viewerRef.current?.loadScene) return;

    preload(scenes[target]);
    viewerRef.current.loadScene(target);
  }, [panoParam, scenes]);

  const subtitulo = unidad
    ? `${unidad.tipo} · ${unidad.frente ? "Frente" : "Contrafrente"} · ${unidad.m2} m²`
    : `Unidad ${id}`;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#e9f0f3]">
      <div className="relative h-full w-full flex">
        {/* SIDEBAR IZQUIERDA */}
        <aside className="relative z-30 w-[360px] shrink-0 bg-white text-slate-900 border-r border-black/10">
          <div className="absolute left-4 top-4 z-40 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-11 w-11 rounded-full bg-emerald-200/70 text-slate-900 shadow-sm border border-black/10 hover:bg-emerald-200 transition flex items-center justify-center"
              aria-label="Menú"
              title="Menú"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="h-11 w-11 rounded-full bg-white/80 text-slate-900 shadow-sm border border-black/10 hover:bg-white transition flex items-center justify-center"
              aria-label="Volver"
              title="Volver"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* (tu menú desplegable + contenido sigue igual) */}
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
                >
                  Explorar edificio
                </Link>
                <Link
                  href="/unidades"
                  className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                >
                  Ver unidades
                </Link>
                <Link
                  href="/ubicacion"
                  className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                >
                  Ubicación
                </Link>
                <Link
                  href="/contacto"
                  className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
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

          <div className="h-full overflow-y-auto px-6 pt-24 pb-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-500">
                  Tour 360°
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight">
                  Unidad {id}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>
              </div>

              <button
                type="button"
                onClick={onBack}
                className="h-10 w-10 rounded-full border border-black/10 bg-white hover:bg-slate-50 transition flex items-center justify-center"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            {unidad && (
              <div className="mt-4">
                <EstadoPill estado={unidad.estado} />
              </div>
            )}

            <hr className="my-6 border-black/10" />

            <p className="text-[11px] uppercase tracking-widest text-slate-500">
              Cómo navegar
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Hotspots
                </p>
                <p className="mt-1 text-sm">
                  Click en los puntos para moverte entre ambientes.
                </p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Miniaturas
                </p>
                <p className="mt-1 text-sm">
                  Abajo podés elegir la panorámica (01 / 02 / 03).
                </p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Volver
                </p>
                <p className="mt-1 text-sm">
                  ESC o el botón de volver te lleva a la planta.
                </p>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-slate-400">
              Estado del visor:{" "}
              <span className="font-semibold">
                {ready ? "Listo" : "Cargando..."}
              </span>
            </p>
          </div>
        </aside>

        {/* VISOR */}
        <section className="relative flex-1">
          <div className="absolute inset-0 bg-[#e9f0f3]" />

          <div className="absolute inset-0">
            <div ref={containerRef} className="h-full w-full" />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div className="rounded-full bg-black/30 backdrop-blur border border-white/10 px-3 py-2 flex items-center gap-2">
              {(["s1", "s2", "s3"] as SceneId[]).map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    preload(scenes[s]);
                    viewerRef.current?.loadScene?.(s);
                  }}
                  className="h-10 w-14 rounded-lg overflow-hidden border border-white/15 hover:border-white/40 transition"
                  title={`Panorámica ${String(i + 1).padStart(2, "0")}`}
                  aria-label={`Panorámica ${i + 1}`}
                >
                  <img
                    src={(thumbs as any)[s] ?? (thumbs as any)[`_fallback${i + 1}`]}
                    alt={`Panorámica ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        (thumbs as any)[`_fallback${i + 1}`];
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .hs-dot {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .hs-dot:hover {
          transform: scale(1.15);
          opacity: 0.9;
        }
      `}</style>
    </main>
  );
}