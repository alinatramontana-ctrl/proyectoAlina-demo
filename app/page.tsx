"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Source_Sans_3 } from "next/font/google";
import Image from "next/image";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Home() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main
      className={`${sourceSans.className} relative min-h-screen overflow-hidden text-white bg-black`}
    >
      {/* VIDEO HERO */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero.jpg"
      />

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/60" />
      <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.45)]" />

      {/* BOTÓN MENU */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menú"
        className="absolute left-6 top-6 z-30 rounded-full border bg-[#8ba0a4] px-4 py-3 backdrop-blur hover:bg-black/60 transition"
      >
        <span className="block h-[2px] w-6 bg-white" />
        <span className="mt-1.5 block h-[2px] w-6 bg-white" />
        <span className="mt-1.5 block h-[2px] w-6 bg-white" />
      </button>

      {/* MENU */}
      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-20 cursor-default"
          />

          <div className="absolute left-6 top-20 z-30 w-[320px] max-w-[calc(100vw-48px)] rounded-[32px] bg-[#EAEAEA] p-6 text-[#183e4b] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] opacity-80">
                  Menú
                </p>
                <h2 className="mt-1 text-xl font-medium leading-tight">
                  Edificio Innovate
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-black/10 px-3 py-1 text-xs uppercase tracking-widest hover:bg-black/15 transition"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {/* ✅ SOLO PC/TABLET: oculto en mobile */}
              <Link
                href="/explorar"
                onClick={() => setOpen(false)}
                className="hidden sm:block rounded-full bg-[#8ba0a4] px-5 py-3 text-center text-xs uppercase tracking-[0.25em] text-[#EAEAEA] hover:brightness-95 transition"
              >
                Explorar edificio
              </Link>

              <Link
                href="/unidades"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#8ba0a4] px-5 py-3 text-center text-xs uppercase tracking-[0.25em] text-[#EAEAEA] hover:brightness-95 transition"
              >
                Ver unidades
              </Link>

              <Link
                href="/ubicacion"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#8ba0a4] px-5 py-3 text-center text-xs uppercase tracking-[0.25em] text-[#EAEAEA] hover:brightness-95 transition"
              >
                Ubicación
              </Link>

              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#8ba0a4] px-5 py-3 text-center text-xs uppercase tracking-[0.25em] text-[#EAEAEA] hover:brightness-95 transition"
              >
                Contacto
              </Link>
            </div>

            <p className="mt-5 text-[11px] opacity-70">
              Tip: presioná <span className="font-medium">ESC</span> para cerrar.
            </p>
          </div>
        </>
      )}

      {/* LOGO CENTRAL */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6">
        <div className="w-[680px] max-w-[90vw]">
          <Image
            src="/images/logo.svg"
            alt="Edificio Innovate"
            width={1600}
            height={500}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </main>
  );
}