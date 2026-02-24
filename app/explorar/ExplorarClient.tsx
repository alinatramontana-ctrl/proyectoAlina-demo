"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { UNIDADES } from "@/lib/unidades";
import TopLeftMenu from "@/app/components/TopLeftMenu";

type Piso = {
  id: string;
  label: string;
  src: string;
};

const PISOS: Piso[] = [
  { id: "azotea", label: "Azotea", src: "/plantas/azotea.jpg" },
  { id: "3", label: "Tercer Piso", src: "/plantas/3.jpg" },
  { id: "2", label: "Segundo Piso", src: "/plantas/2.jpg" },
  { id: "1", label: "Primer Piso", src: "/plantas/1.jpg" },
  { id: "pb", label: "Planta Baja", src: "/plantas/pb.jpg" },
];

type Hotspot = {
  pisoId: string;
  unidadId: string;
  label: string;
  x: number;
  y: number;
};

const HOTSPOTS: Hotspot[] = [
  { pisoId: "1", unidadId: "1A", label: "1A", x: 50, y: 55 },
  { pisoId: "1", unidadId: "1B", label: "1B", x: 65, y: 55 },

  { pisoId: "2", unidadId: "2A", label: "2A", x: 50, y: 55 },
  { pisoId: "2", unidadId: "2B", label: "2B", x: 68, y: 55 },

  { pisoId: "3", unidadId: "3A", label: "3A", x: 50, y: 60 },
  { pisoId: "3", unidadId: "3B", label: "3B", x: 68, y: 60 },

  { pisoId: "pb", unidadId: "L1", label: "L1", x: 45, y: 50 },
  { pisoId: "pb", unidadId: "L2", label: "L2", x: 70, y: 50 },
];

function estadoStyles(estado: string) {
  if (estado === "Disponible") {
    return {
      pin: "bg-emerald-400",
      ring: "bg-emerald-400/25",
      badge: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10",
    };
  }
  if (estado === "Reservado") {
    return {
      pin: "bg-amber-400",
      ring: "bg-amber-400/25",
      badge: "border-amber-400/50 text-amber-300 bg-amber-400/10",
    };
  }
  return {
    pin: "bg-zinc-500",
    ring: "bg-zinc-500/25",
    badge: "border-zinc-500/50 text-zinc-400 bg-zinc-500/10",
  };
}

export default function ExplorarClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const floorParam = (searchParams.get("floor") ?? "").toLowerCase();
  const pisoInicial =
    PISOS.find((p) => p.id.toLowerCase() === floorParam) ?? PISOS[0];

  const [plantaActual, setPlantaActual] = useState<Piso>(pisoInicial);

  // ✅ mejora de “delay”: mantener la anterior hasta que cargue la nueva
  const [imgSrc, setImgSrc] = useState<string>(pisoInicial.src);
  const [loadingPlanta, setLoadingPlanta] = useState(false);

  // ✅ mobile tap: abrir/cerrar card por unidad
  const [activeUnidadId, setActiveUnidadId] = useState<string | null>(null);

  // sync con query param
  useEffect(() => {
    const next =
      PISOS.find((p) => p.id.toLowerCase() === floorParam) ?? PISOS[0];
    setPlantaActual(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorParam]);

  // precarga plantas
  useEffect(() => {
    PISOS.forEach((p) => {
      const img = new Image();
      img.decoding = "async";
      img.src = p.src;
    });
  }, []);

  // swap suave
  useEffect(() => {
    const nextSrc = plantaActual.src;
    if (!nextSrc || nextSrc === imgSrc) return;

    setLoadingPlanta(true);
    const img = new Image();
    img.decoding = "async";
    img.src = nextSrc;

    const done = () => {
      setImgSrc(nextSrc);
      setLoadingPlanta(false);
    };

    img.onload = done;
    img.onerror = done;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [plantaActual.src, imgSrc]);

  // ESC → volver al inicio
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.push("/");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const hotspotsDelPiso = useMemo(
    () => HOTSPOTS.filter((h) => h.pisoId === plantaActual.id),
    [plantaActual.id]
  );

  return (
    <main
      className="relative h-screen w-screen bg-[#0b0f11] sm:bg-black text-white overflow-hidden"
      onClick={() => setActiveUnidadId(null)}
    >
      <TopLeftMenu backHref="/" />

      {/* PLANO FULL SCREEN */}
      <div className="absolute inset-0">
        <img
          src={imgSrc}
          alt={`Plano ${plantaActual.label}`}
          className="absolute inset-0 h-full w-full object-contain sm:object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/20" />
        {loadingPlanta && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        )}
      </div>

      {/* HOTSPOTS */}
      <div className="absolute inset-0 z-20">
        {hotspotsDelPiso.map((h) => {
          const u = UNIDADES.find(
            (x) =>
              String(x.id).toUpperCase() === String(h.unidadId).toUpperCase()
          );
          if (!u) return null;

          const vendido = u.estado === "Vendido";
          const styles = estadoStyles(u.estado);
          const isPBOrLocal =
            plantaActual.id === "pb" ||
            String(u.tipo).toLowerCase() === "local";

          const isOpen = activeUnidadId === String(u.id);

          return (
            <div
              key={`${h.pisoId}-${h.unidadId}`}
              className={`group absolute ${
                vendido ? "pointer-events-none opacity-80" : ""
              }`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveUnidadId((prev) =>
                  prev === String(u.id) ? null : String(u.id)
                );
              }}
            >
              {/* pin */}
              <span className="relative block -translate-x-1/2 -translate-y-1/2">
                <span
                  className={`absolute inset-0 rounded-full ${styles.ring} animate-ping`}
                />
                <span
                  className={`relative block h-3 w-3 rounded-full ${styles.pin} shadow-[0_0_0_6px_rgba(0,0,0,0.25)]`}
                />
              </span>

              {/* label */}
              <span className="absolute left-1/2 top-1/2 mt-3 -translate-x-1/2 text-[11px] uppercase tracking-widest text-white/80">
                {h.label}
              </span>

              {/* card hover (desktop) + tap (mobile) */}
              {!vendido && (
                <div
                  className={[
                    "absolute left-1/2 top-1/2 mt-6 -translate-x-1/2 z-30 w-[280px]",
                    // Desktop hover
                    "pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                    // Mobile tap
                    isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "",
                    "transition",
                  ].join(" ")}
                >
                  <div
                    className="rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{u.nombre}</p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {u.tipo} – {u.frente ? "Frente" : "Contrafrente"} –{" "}
                          {u.m2} m²
                        </p>
                      </div>

                      <span
                        className={`text-[10px] uppercase tracking-widest rounded-full px-2 py-1 border ${styles.badge}`}
                      >
                        {u.estado}
                      </span>
                    </div>

                    <div
                      className={`mt-3 grid ${
                        isPBOrLocal ? "grid-cols-1" : "grid-cols-3"
                      } gap-2`}
                    >
                      {!isPBOrLocal && (
                        <>
                          <Link
                            href={`/explorar/unidad/${u.id}?floor=${encodeURIComponent(
                              plantaActual.id
                            )}`}
                            className="flex items-center justify-center text-center border border-white/30 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-widest leading-none hover:bg-white hover:text-black transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Explorar
                          </Link>

                          <Link
                            href={`/tour/${u.id}?from=explorar&floor=${encodeURIComponent(
                              plantaActual.id
                            )}`}
                            className="flex items-center justify-center text-center border border-white/30 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-widest leading-none hover:bg-white hover:text-black transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Tour 360°
                          </Link>
                        </>
                      )}

                      <Link
                        href={`/contacto?unidad=${encodeURIComponent(u.nombre)}`}
                        className="flex items-center justify-center text-center border border-white/30 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-widest leading-none hover:bg-white hover:text-black transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Consultar precio
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CARD PISOS RESPONSIVE */}
      <aside
        className="
          fixed z-40
          left-1/2 -translate-x-1/2 bottom-4
          w-[92vw] max-w-[520px]
          sm:absolute sm:left-auto sm:bottom-auto sm:right-6 sm:top-1/2
          sm:-translate-y-1/2 sm:translate-x-0 sm:w-[220px]
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-[26px] bg-[#EAEAEA] p-3 sm:p-4 shadow-xl">
          <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible">
            {PISOS.map((p) => {
              const active = plantaActual.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveUnidadId(null);
                    setPlantaActual(p);
                  }}
                  className={[
                    "shrink-0 rounded-full px-4 py-3 text-[11px] uppercase tracking-widest transition",
                    "min-w-[150px] sm:min-w-0",
                    active
                      ? "bg-[#183e4b] text-[#EAEAEA]"
                      : "bg-[#8ba0a4] text-[#EAEAEA] hover:opacity-90",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-[#183e4b]/70 sm:hidden">
            Tocá un punto para ver acciones. Deslizá para ver más pisos.
          </p>
        </div>
      </aside>
    </main>
  );
}