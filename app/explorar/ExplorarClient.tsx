"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { UNIDADES } from "@/lib/unidades";

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

  { pisoId: "3", unidadId: "3A", label: "3A", x: 50, y: 55 },
  { pisoId: "3", unidadId: "3B", label: "3B", x: 68, y: 55 },

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

  // Menú (botón + card)
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const next =
      PISOS.find((p) => p.id.toLowerCase() === floorParam) ?? PISOS[0];
    setPlantaActual(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorParam]);

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
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {/* PLANO FULL SCREEN */}
      <div className="absolute inset-0">
        <img
          src={plantaActual.src}
          alt={`Plano ${plantaActual.label}`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* overlay suave para que todo se lea mejor */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* TOP LEFT: botones fijos + menú ABSOLUTO (NO mueve los botones) */}
      <div className="fixed left-6 top-6 z-50">
        {/* Este wrapper "relative" es la clave: el menú se posiciona absoluto debajo */}
        <div className="relative">
          <div className="flex items-center gap-3">
            {/* MENU (primero) */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
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

            {/* VOLVER (segundo) */}
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

          {/* CARD MENU: se abre HACIA ABAJO, sin empujar nada */}
          {menuOpen && (
            <>
              {/* Backdrop invisible para cerrar al click afuera */}
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute left-0 top-[56px] z-50 w-[270px] rounded-[26px] bg-[#EAEAEA] text-[#183e4b] shadow-xl overflow-hidden">
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
                    Tip: presioná <span className="font-semibold">ESC</span>{" "}
                    para volver al inicio.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
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

          return (
            <div
              key={`${h.pisoId}-${h.unidadId}`}
              className={`group absolute ${
                vendido ? "pointer-events-none opacity-80" : ""
              }`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span className="relative block -translate-x-1/2 -translate-y-1/2">
                <span
                  className={`absolute inset-0 rounded-full ${styles.ring} animate-ping`}
                />
                <span
                  className={`relative block h-3 w-3 rounded-full ${styles.pin} shadow-[0_0_0_6px_rgba(0,0,0,0.25)]`}
                />
              </span>

              <span className="absolute left-1/2 top-1/2 mt-3 -translate-x-1/2 text-[11px] uppercase tracking-widest text-white/80">
                {h.label}
              </span>

              {!vendido && (
                <div className="pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition absolute left-1/2 top-1/2 mt-6 -translate-x-1/2 z-30 w-[280px]">
                  <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{u.nombre}</p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {u.tipo} –{" "}
                          {u.frente ? "Frente" : "Contrafrente"} – {u.m2} m²
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

      {/* CARD DERECHA (centrada verticalmente) */}
      <aside className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-[220px]">
        <div className="rounded-[26px] bg-[#EAEAEA] p-4 shadow-xl">
          <div className="flex flex-col gap-3">
            {PISOS.map((p) => {
              const active = plantaActual.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlantaActual(p)}
                  className={[
                    "rounded-full px-4 py-3 text-[11px] uppercase tracking-widest transition",
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
        </div>
      </aside>
    </main>
  );
}