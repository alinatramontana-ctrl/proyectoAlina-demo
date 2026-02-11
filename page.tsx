export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      
      {/* Fondo (imagen o video más adelante) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />

      {/* Contenido */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6">
          Edificio Demo
        </h1>

        <p className="max-w-xl text-zinc-300 mb-10">
          Showroom inmobiliario interactivo
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button className="border border-white/40 px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition">
            Explorar edificio
          </button>

          <button className="border border-white/40 px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition">
            Ver unidades
          </button>

          <button className="border border-white/40 px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition">
            Ubicación
          </button>
        </div>
      </div>
    </main>
  );
}
