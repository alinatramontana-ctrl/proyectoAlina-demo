"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [consulta, setConsulta] = useState("");

  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.push("/");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Por ahora: “simulado”
    setEnviado(true);

    // opcional: limpiar campos
    setNombre("");
    setEmail("");
    setTelefono("");
    setConsulta("");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 py-28">
        <h1 className="text-center text-4xl font-light tracking-wide">
          Contacto
        </h1>

        <p className="mt-3 text-center text-zinc-300">
  Dejanos tu consulta y te respondemos a la brevedad.
</p>




        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {enviado && (
            <div className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4 text-base text-zinc-200">
              Tu mensaje ha sido enviado, en breve nos contactaremos.
            </div>
          )}

          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-zinc-300">
                Nombre y apellido
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-zinc-300">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-zinc-300">
                  Teléfono
                </label>
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
                  placeholder="+54 9 ..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-zinc-300">
                Consulta
              </label>
              <textarea
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                className="mt-2 min-h-[140px] w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
                placeholder="Contanos qué estás buscando..."
                required
              />
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
  {/* Grupo principal */}
  <div className="flex gap-4">
    <button
      type="submit"
      className="border border-white/30 bg-black/30 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
    >
      Enviar
    </button>

    <button
      type="button"
      onClick={() => router.push("/")}
      className="border border-white/30 bg-black/30 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
    >
      Volver
    </button>
  </div>

  {/* WhatsApp separado */}
  <a
    href="https://wa.me/5493413257303?text=Hola%2C%20quisiera%20recibir%20mas%20informacion"
    target="_blank"
    rel="noopener noreferrer"
    className="border border-white/30 bg-black/20 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
  >
    WhatsApp
  </a>
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              Tip: presioná <span className="text-zinc-300">ESC</span> para salir
              al inicio.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
