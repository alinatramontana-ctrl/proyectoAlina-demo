"use client";

import Link from "next/link";
import { useState } from "react";

export default function TopLeftMenu({ backHref = "/" }: { backHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Botonera */}
      <div className="absolute left-6 top-6 z-50 flex items-center gap-3">
        {/* MENÚ */}
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
        <Link
          href={backHref}
          className="h-11 w-11 rounded-full bg-white text-slate-900 shadow-sm border border-black/10 hover:bg-slate-50 transition flex items-center justify-center"
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
        </Link>
      </div>

      {/* Card menú */}
      {menuOpen && (
        <div className="absolute left-6 top-[84px] z-50 w-[300px] rounded-[26px] bg-[#EAEAEA] text-[#183e4b] shadow-xl overflow-hidden">
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
            {/* ✅ SOLO DESKTOP/TABLET: oculto en mobile */}
            <Link
  href="/explorar"
  className="hidden sm:block rounded-full bg-[#8ba0a4] text-[#EAEAEA] text-[11px] uppercase tracking-widest py-3 text-center hover:opacity-90 transition"
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
          </div>
        </div>
      )}
    </>
  );
}