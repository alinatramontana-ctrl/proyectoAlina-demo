import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Fondo del header (muy sutil, sin franja blanca) */}
      <div className="absolute inset-0 bg-black border-b border-white/10" />

    <div className="relative w-full px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
</div>

        {/* Logo / Nombre */}
        <Link href="/" className="text-xs uppercase tracking-[0.35em] font-light">
          Edificio Demo
        </Link>

        {/* Navegación */}
        <nav className="flex gap-6 text-xs uppercase tracking-[0.35em]">
  <Link href="/explorar" className="hover:text-zinc-300 text-white/80">
    Explorar
  </Link>
  <Link href="/unidades" className="hover:text-zinc-300 text-white/80">
    Unidades
  </Link>
  <Link href="/ubicacion" className="hover:text-zinc-300 text-white/80">
    Ubicación
  </Link>
  <Link href="/contacto" className="hover:text-zinc-300 text-white/80">
    Contacto
  </Link>
</nav>

      </div>
    </header>
  );
}
