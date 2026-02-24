"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UNIDADES, type Unidad } from "../../lib/unidades";

type EstadoFiltro = "Todos" | Unidad["estado"];
type DormFiltro = "Todos" | 0 | 1;

const ESTADOS: EstadoFiltro[] = ["Todos", "Disponible", "Reservado", "Vendido"];
const DORMS: DormFiltro[] = ["Todos", 0, 1];

function FiltroPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-3 text-[11px] uppercase tracking-widest transition ${
        active
          ? "bg-[#183e4b] text-white"
          : "bg-[#8ba0a4] text-[#EAEAEA] hover:opacity-90"
      }`}
    >
      {children}
    </button>
  );
}

function EstadoBadge({ estado }: { estado: Unidad["estado"] }) {
  const base = "text-[10px] uppercase tracking-widest px-3 py-1 rounded-full";

  if (estado === "Disponible") {
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700`}>
        {estado}
      </span>
    );
  }
  if (estado === "Reservado") {
    return (
      <span className={`${base} bg-amber-100 text-amber-700`}>
        {estado}
      </span>
    );
  }
  return (
    <span className={`${base} bg-rose-100 text-rose-700`}>{estado}</span>
  );
}

function PisoTitulo({ planta }: { planta: number }) {
  const label =
    planta === 0
      ? "Planta Baja"
      : planta === 1
      ? "Primer Piso"
      : planta === 2
      ? "Segundo Piso"
      : "Tercer Piso";

  return (
    <div className="mt-12">
      <div className="text-[#183e4b] text-xs uppercase tracking-[0.35em]">
        {label}
      </div>
      <div className="mt-3 h-px bg-black/10" />
    </div>
  );
}

export default function UnidadesPage() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("Todos");
  const [dormFiltro, setDormFiltro] = useState<DormFiltro>("Todos");
  const [menuOpen, setMenuOpen] = useState(false);

  const unidadesFiltradas = useMemo(() => {
    return UNIDADES.filter((u) => {
      const okEstado =
        estadoFiltro === "Todos" ? true : u.estado === estadoFiltro;

      const okDorm =
        dormFiltro === "Todos" ? true : u.dorm === Number(dormFiltro);

      return okEstado && okDorm;
    });
  }, [estadoFiltro, dormFiltro]);

  const gruposPorPiso = useMemo(() => {
    const map = new Map<Unidad["planta"], Unidad[]>();

    for (const u of unidadesFiltradas) {
      if (!map.has(u.planta)) map.set(u.planta, []);
      map.get(u.planta)!.push(u);
    }

    const orden: Unidad["planta"][] = [0, 1, 2, 3];
    return orden
      .filter((p) => map.has(p))
      .map((p) => ({ planta: p, unidades: map.get(p)! }));
  }, [unidadesFiltradas]);

  return (
    <main className="min-h-screen bg-[#EAEAEA] text-slate-900">
      {/* BOTONERA SUPERIOR IZQUIERDA */}
<div className="absolute left-6 top-6 z-50 flex items-center gap-3">
  {/* MENÚ */}
  <button
    type="button"
    onClick={() => setMenuOpen((v) => !v)}
    className="h-11 w-11 rounded-full bg-emerald-200/70 text-slate-900 shadow-sm border border-black/10 hover:bg-emerald-200 transition flex items-center justify-center"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>

  {/* VOLVER */}
  <button
    type="button"
    onClick={() => router.push("/")}
    className="h-11 w-11 rounded-full bg-white text-slate-900 shadow-sm border border-black/10 hover:bg-slate-50 transition flex items-center justify-center"
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

{menuOpen && (
  <div className="absolute left-6 top-[84px] z-50 w-[300px] rounded-[26px] bg-[#EAEAEA] text-[#183e4b] shadow-xl overflow-hidden">
    <div className="px-5 pt-4 pb-3 flex items-start justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#183e4b]/70">
          Menú
        </p>
        <p className="mt-1 text-lg font-semibold">
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
    </div>
  </div>
)}
      <section className="mx-auto max-w-6xl px-6 py-20">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-5xl tracking-tight text-[#183e4b]">Unidades</h1>
          <div className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-500">
            {unidadesFiltradas.length} disponibles
          </div>
        </div>

        {/* FILTROS */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {ESTADOS.map((e) => (
              <FiltroPill
                key={e}
                active={estadoFiltro === e}
                onClick={() => setEstadoFiltro(e)}
              >
                {e}
              </FiltroPill>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {DORMS.map((d) => (
              <FiltroPill
                key={String(d)}
                active={dormFiltro === d}
                onClick={() => setDormFiltro(d)}
              >
                {d === "Todos" ? "Todos" : `${d} dorm`}
              </FiltroPill>
            ))}
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="mt-16">
          {gruposPorPiso.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-white p-8 text-slate-500 text-center shadow-sm">
              No hay unidades para esos filtros.
            </div>
          ) : (
            gruposPorPiso.map(({ planta, unidades }) => (
              <div key={String(planta)}>
                <PisoTitulo planta={planta} />

                {/* ✅ contenedor centrado para las cards */}
                <div className="mt-8 mx-auto max-w-4xl">
                  <div
  className={`grid gap-8 sm:grid-cols-2 ${
    unidades.length === 1 ? "justify-items-center" : ""
  }`}
>
                    {unidades.map((u) => {
                      const consultarHref = `/contacto?unidad=${encodeURIComponent(
                        u.nombre
                      )}`;

                      return (
                        <article
                          key={u.id}
                          className="rounded-2xl bg-white p-8 shadow-sm border border-black/5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {u.nombre}
                              </h3>
                              <p className="mt-2 text-sm text-slate-500">
                                {u.tipo} · {u.banos} baño
                                {u.banos === 1 ? "" : "s"} ·{" "}
                                {u.frente ? "frente" : "contrafrente"}
                              </p>
                            </div>
                            <EstadoBadge estado={u.estado} />
                          </div>

                          {/* ✅ métricas más juntas + Consultar precio ahí mismo */}
                          <div className="mt-6 grid grid-cols-2 gap-2 items-end">
                            <div>
                              <div className="text-xs uppercase tracking-widest text-slate-400">
                                m²
                              </div>
                              <div className="mt-1 text-lg">{u.m2}</div>
                            </div>

                            <div>
                              <div className="text-xs uppercase tracking-widest text-slate-400">
                                dorm
                              </div>
                              <div className="mt-1 text-lg">{u.dorm}</div>
                            </div>

                            <Link
                              href={consultarHref}
                              className="col-span-2 mt-2 inline-flex justify-center rounded-full border border-[#183e4b]/20 bg-white px-5 py-3 text-[11px] uppercase tracking-widest text-[#183e4b] hover:bg-[#183e4b] hover:text-white transition"
                            >
                              Consultar precio
                            </Link>
                          </div>

                          <div className="mt-6 flex flex-col gap-3">
                            <Link
                              href={`/explorar/unidad/${u.id}?from=unidades`}
                              className="rounded-full bg-[#183e4b] text-white text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                            >
                              Ver detalle
                            </Link>

                            {u.tipo !== "Local" && (
                              <Link
                                href={`/tour/${u.id}?from=unidades`}
                                className="rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
                              >
                                Tour 360°
                              </Link>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}