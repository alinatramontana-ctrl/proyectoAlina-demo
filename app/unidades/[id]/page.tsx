import Link from "next/link";
import { notFound } from "next/navigation";
import { UNIDADES } from "@/lib/unidades";
import EscapeToHome from "../../components/EscapeToHome"
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
  const id = String(params?.id ?? "").toLowerCase();

  // ✅ Match case-insensitive
  const unidad = UNIDADES.find((u) => String(u.id).toLowerCase() === id);
  if (!unidad) notFound();

  const frenteTxt = unidad.frente ? "Frente" : "Contrafrente";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ✅ ESC => vuelve al inicio */}
      <EscapeToHome />

      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        {/* breadcrumb */}
        <div className="text-xs tracking-widest uppercase text-zinc-400">
          <Link href="/unidades" className="hover:text-white transition">
            Unidades
          </Link>{" "}
          <span className="text-zinc-600">/</span> {unidad.id}
        </div>

        {/* header */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight">
              {unidad.nombre}
            </h1>
            <p className="mt-2 text-zinc-300">
              {unidad.planta} · {unidad.tipo} · {unidad.banos} baño · {frenteTxt} ·{" "}
              {unidad.m2} m²
            </p>
          </div>

          <div className="flex items-center gap-4">
            <EstadoBadge estado={unidad.estado} />
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-widest text-zinc-400">
                Precio
              </div>
              <div className="text-xl">{unidad.precio}</div>
            </div>
          </div>
        </div>

        {/* layout */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* media placeholder */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="relative aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-300">
                    Vista / Render
                  </p>
                  <p className="mt-2 text-zinc-400">
                    (Acá después ponemos renders o galería)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* data */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Datos
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-widest text-zinc-400">
                  Planta
                </div>
                <div className="mt-1">{unidad.planta}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-widest text-zinc-400">
                  ID
                </div>
                <div className="mt-1">{unidad.id}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-widest text-zinc-400">
                  M²
                </div>
                <div className="mt-1">{unidad.m2}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-widest text-zinc-400">
                  Tipo
                </div>
                <div className="mt-1">{unidad.tipo}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-widest text-zinc-400">
                  Baños
                </div>
                <div className="mt-1">{unidad.banos}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-widest text-zinc-400">
                  Orientación
                </div>
                <div className="mt-1">{frenteTxt}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                href={`/unidades/${unidad.id}#tour`}
                className="border border-white/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
              >
                Tour 360
              </Link>

              <Link
                href="/unidades"
                className="border border-white/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
