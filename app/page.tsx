import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Video de fondo */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero.jpg"
      />

      {/* Overlays (más suaves) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/60" />
      <div className="absolute inset-0 [box-shadow:inset_0_0_100px_rgba(0,0,0,0.35)]" />

      {/* Contenido */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6">
          Edificio Demo
        </h1>

        <p className="max-w-xl text-zinc-200 mb-10">
          Showroom inmobiliario interactivo
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/explorar"
            className="border border-white/90 bg-black/60 px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            Explorar edificio
          </Link>

          <Link
            href="/unidades"
            className="border border-white/90 bg-black/60 px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            Ver unidades
          </Link>

          <Link
            href="/ubicacion"
            className="border border-white/90 bg-black/60 px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            Ubicación
          </Link>
          <Link
    href="/contacto"
    className="border border-white/90 bg-black/60 px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition"
  >
    Contacto
  </Link>
</div>
        </div>
    </main>
  );
}
