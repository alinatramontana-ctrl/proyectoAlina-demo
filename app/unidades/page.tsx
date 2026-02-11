"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { UNIDADES, type Unidad } from "../../lib/unidades";

type EstadoFiltro = "Todos" | Unidad["estado"];
type DormFiltro = "Todos" | 0 | 1;

const ESTADOS: EstadoFiltro[] = ["Todos", "Disponible", "Reservado", "Vendido"];
const DORMS: DormFiltro[] = ["Todos", 0, 1,];

function EstadoBadge({ estado }: { estado: Unidad["estado"] }) {
  const base =
    "text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border";

  if (estado === "Disponible") {
    return (
      <span className={`${base} border-emerald-300/50 text-emerald-200 bg-emerald-500/10`}>
        {estado}
      </span>
    );
  }
  if (estado === "Reservado") {
    return (
      <span className={`${base} border-amber-300/50 text-amber-200 bg-amber-500/10`}>
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
      className={
        active
          ? "rounded-full bg-white text-black px-4 py-2 text-xs uppercase tracking-widest"
          : "rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs uppercase tracking-widest text-white hover:border-white/30"
      }
    >
      {children}
    </button>
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
    <div className="mt-6">
      <div className="text-zinc-400 text-xs uppercase tracking-[0.35em]">
        {label}
      </div>
      <div className="mt-3 h-px bg-white/10" />
    </div>
  );
}
export default function UnidadesPage() {
  const router = useRouter();

useEffect(() => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") router.push("/unidades");
  };
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [router]);

useEffect(() => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") router.push("/");
  };
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [router]);
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("Todos");
  const [dormFiltro, setDormFiltro] = useState<DormFiltro>("Todos");

  const unidadesFiltradas = useMemo(() => {
  return UNIDADES.filter((u) => {
    const okEstado =
      estadoFiltro === "Todos" ? true : u.estado === estadoFiltro;

    const okDorm =
      dormFiltro === "Todos"
        ? true
        : u.dorm === Number(dormFiltro);

    return okEstado && okDorm;
  });
}, [estadoFiltro, dormFiltro]);

  const gruposPorPiso = useMemo(() => {
  const map = new Map<Unidad["planta"], Unidad[]>();

  for (const u of unidadesFiltradas) {
    const key = u.planta;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(u);
  }

  const orden: Unidad["planta"][] = [0, 1, 2, 3];
  return orden
    .filter((p) => map.has(p))
    .map((p) => ({ planta: p, unidades: map.get(p)! }));
}, [unidadesFiltradas]);


  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl tracking-tight">Unidades</h1>
            <p className="mt-3 text-zinc-300">
              Catálogo de unidades (demo). Luego lo conectamos a un buscador real.
            </p>
          </div>

          <div className="hidden sm:block text-xs uppercase tracking-[0.35em] text-zinc-400">
            {unidadesFiltradas.length} unidades
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {ESTADOS.map((e) => (
              <FiltroPill
                key={e}
                active={estadoFiltro === e}
                onClick={() => setEstadoFiltro(e)}
              >
                {e === "Todos" ? "Todos" : e}
              </FiltroPill>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
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

        {/* Grupos por piso */}
        <div className="mt-6">
          {gruposPorPiso.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-zinc-300">
              No hay unidades para esos filtros.
            </div>
          ) : (
            gruposPorPiso.map(({ planta, unidades }) => (
  <div key={String(planta)}>
    <PisoTitulo planta={planta} />

                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {unidades.map((u) => (
                    <article
                      key={u.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl">{u.nombre}</h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {u.tipo} · {u.banos} baño{u.banos === 1 ? "" : "s"} ·{" "}
                            {u.frente ? "frente" : "contrafrente"}
                          </p>
                        </div>
                        <EstadoBadge estado={u.estado} />
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                          <div className="text-zinc-400 text-xs uppercase tracking-widest">
                            m²
                          </div>
                          <div className="mt-1 text-lg">{u.m2}</div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                          <div className="text-zinc-400 text-xs uppercase tracking-widest">
                            dorm
                          </div>
                          <div className="mt-1 text-lg">{u.dorm}</div>
                        </div>
                        <div className="mt-1 text-sm">
  <Link
    href={`/contacto?unidad=${encodeURIComponent(u.nombre)}`}
    className="inline-flex items-center gap-2 hover:text-white transition"
  >
    Consultar precio <span aria-hidden>→</span>
  </Link>
</div>

                      </div>

                      <div className="mt-6 flex gap-3 flex-wrap">
                        <Link
  href={`/explorar/unidad/${u.id}?from=unidades`}
  className="border border-white/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
>
  Ver detalle
</Link>


                        {u.tipo !== "Local" && (
  <Link
    href={`/tour/${u.id}`}
    className="border border-white/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
  >
    Tour 360°
  </Link>
)}

                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
