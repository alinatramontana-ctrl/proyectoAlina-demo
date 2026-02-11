"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type SceneId = "s1" | "s2" | "s3";
type UnitId = "1A" | "1B" | "2A" | "2B" | "3A" | "3B";

type HS = { pitch: number; yaw: number; to: SceneId };

type UnitHotspots = Record<SceneId, HS[]>;

// ✅ HOTSPOTS POR UNIDAD
// - Cada escena puede tener 0, 1 o 2+ hotspots (ej: s1 puede ir a s2 y s3)
const HOTSPOTS_BY_UNIT: Partial<Record<UnitId, UnitHotspots>> = {
  // ====== 1A (YA LO TENÉS) ======
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

  // ====== 1B (PONÉ TUS COORDS) ======
  // 🔧 Reemplazá pitch/yaw por los tuyos
  "1B": {
  s1: [
    { pitch: -34, yaw: 85, to: "s2" }, // S1 → S2
    { pitch: -34, yaw: 55.0, to: "s3" },  // S1 → S3
  ],
  s2: [
    // dejalo así por ahora, lo completamos cuando me pases coords
    { pitch: -39, yaw: 177, to: "s1" },
    { pitch: -44, yaw: -94, to: "s3" },
  ],
  s3: [
    // idem
    { pitch: -24, yaw: -139, to: "s1" },
  ],
},

  // ====== 2A (PONÉ TUS COORDS) ======
  "2A": {
    s1: [
      { pitch: -26, yaw: 26, to: "s2" },
      { pitch: -43, yaw: -89, to: "s3" },
    ],
    s2: [
      { pitch: -48, yaw: -159, to: "s1" },
    
    ],
    s3: [{ pitch: -55, yaw: -132, to: "s1" }],
  },

  // ====== 2B (PONÉ TUS COORDS) ======
  "2B": {
    s1: [
      { pitch: -24.67, yaw: 102, to: "s2" },
      { pitch: -36, yaw: 86, to: "s3" },
    ],
    s2: [
      { pitch: -63, yaw: -144, to: "s1" },
    
    ],
    s3: [{ pitch: -51, yaw: -52, to: "s1" }],
  },

  // ====== 3A (PONÉ TUS COORDS) ======
  "3A": {
    s1: [
      { pitch: -26, yaw: 26, to: "s2" },
      { pitch: -43, yaw: -89, to: "s3" },
    ],
    s2: [
      { pitch: -48, yaw: -159, to: "s1" },
    
    ],
    s3: [{ pitch: -55, yaw: -132, to: "s1" }],
  },

  // ====== 2B (PONÉ TUS COORDS) ======
  "3B": {
    s1: [
      { pitch: -24.67, yaw: 102, to: "s2" },
      { pitch: -36, yaw: 86, to: "s3" },
    ],
    s2: [
      { pitch: -63, yaw: -144, to: "s1" },
    
    ],
    s3: [{ pitch: -51, yaw: -52, to: "s1" }],
  },
  
  // ====== 3A y 3B: si piso 3 es igual al 2, NO HACE FALTA definirlos
  // porque van a usar el mismo patrón fallback.
  // Si querés que tengan coords exactas, los agregamos igual.
};

export default function TourPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const id = String(params?.id ?? "").toUpperCase();
  const unitId = id as UnitId;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  const [ready, setReady] = useState(false);

  // URLs reales
  const scenes = useMemo(() => {
    const base = `/panos/${encodeURIComponent(id)}`;
    return {
      s1: `${base}/01.jpg`,
      s2: `${base}/02.jpg`,
      s3: `${base}/03.jpg`,
    } as const;
  }, [id]);

  // Volver inteligente
  const backHref = useMemo(() => {
    const from = searchParams.get("from");
    const floor = searchParams.get("floor");
    if (from === "explorar" && floor)
      return `/explorar?floor=${encodeURIComponent(floor)}`;
    if (from === "unidades") return "/unidades";
    return "";
  }, [searchParams]);

  // ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (backHref) router.push(backHref);
      else router.back();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, backHref]);

  // Init Pannellum
  useEffect(() => {
    if (!containerRef.current) return;

    const pannellum = (window as any).pannellum;
    if (!pannellum?.viewer) return;

    try {
      viewerRef.current?.destroy?.();
    } catch {}
    viewerRef.current = null;

    const unitHotspots = HOTSPOTS_BY_UNIT[unitId];

    // ✅ fallback si la unidad no está definida: navegación simple y segura
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
        clickHandlerFunc: () => viewerRef.current?.loadScene?.(h.to),
      }));

    const cfg = {
      default: {
        firstScene: "s1",
        autoLoad: true,
        showControls: true,
        compass: false,
        sceneFadeDuration: 900,
        hotSpotDebug: true, // 🔧 medidor
      },
      scenes: {
        s1: {
          type: "equirectangular",
          panorama: scenes.s1,
          hotSpots: toHotSpots(active.s1),
        },
        s2: {
          type: "equirectangular",
          panorama: scenes.s2,
          hotSpots: toHotSpots(active.s2),
        },
        s3: {
          type: "equirectangular",
          panorama: scenes.s3,
          hotSpots: toHotSpots(active.s3),
        },
      },
    };

    viewerRef.current = pannellum.viewer(containerRef.current, cfg);
    setReady(true);

    return () => {
      try {
        viewerRef.current?.destroy?.();
      } catch {}
      viewerRef.current = null;
      setReady(false);
    };
  }, [scenes, unitId]);

  const onBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-400">
            Tour 360°
          </p>
          <h1 className="mt-2 text-2xl font-light">Unidad {id}</h1>
        </div>

        <button
          onClick={onBack}
          className="border border-white/30 bg-black/30 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
        >
          Volver
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="h-[85vh] w-full">
            <div ref={containerRef} className="h-full w-full" />
          </div>

          <div className="p-4 text-xs text-zinc-500">
            {ready
              ? "Click en los círculos para moverte entre ambientes."
              : "Cargando..."}
          </div>
        </div>
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

function hotspotDot(hotSpotDiv: HTMLDivElement) {
  hotSpotDiv.classList.add("hs-dot");
  hotSpotDiv.innerHTML = "";
}
