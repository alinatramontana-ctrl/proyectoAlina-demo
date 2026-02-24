"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopLeftMenu from "@/app/components/TopLeftMenu";

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
    setEnviado(true);

    setNombre("");
    setEmail("");
    setTelefono("");
    setConsulta("");
  }

  return (
    <main className="relative min-h-screen bg-[#EAEAEA] text-slate-900">
      <TopLeftMenu backHref="/" />

      <section className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <h1 className="text-center text-5xl tracking-tight text-[#183e4b]">
            Contacto
          </h1>

          <p className="mt-3 text-center text-slate-600">
            Dejanos tu consulta y te respondemos a la brevedad.
          </p>

          <div className="mt-10 rounded-[26px] bg-[#EAEAEA] p-6 shadow-xl border border-black/10">
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-black/10">
              {enviado && (
                <div className="mb-6 rounded-2xl border border-black/10 bg-[#EAEAEA] p-4 text-sm text-[#183e4b]">
                  Tu mensaje ha sido enviado, en breve nos contactaremos.
                </div>
              )}

              <form onSubmit={onSubmit} className="grid gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.35em] text-[#183e4b]/70">
                    Nombre y apellido
                  </label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.35em] text-[#183e4b]/70">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-[0.35em] text-[#183e4b]/70">
                      Teléfono
                    </label>
                    <input
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                      placeholder="+54 9 ..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.35em] text-[#183e4b]/70">
                    Consulta
                  </label>
                  <textarea
                    value={consulta}
                    onChange={(e) => setConsulta(e.target.value)}
                    className="mt-2 min-h-[140px] w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                    placeholder="Contanos qué estás buscando..."
                    required
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-[#183e4b] text-white text-[11px] uppercase tracking-widest px-6 py-3 text-center hover:opacity-90 transition"
                  >
                    Enviar
                  </button>

                  <a
                    href="https://wa.me/5493413257303?text=Hola%2C%20quisiera%20recibir%20mas%20informacion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#8ba0a4] text-white text-[11px] uppercase tracking-widest px-6 py-3 text-center hover:opacity-90 transition"
                  >
                    WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-full bg-[#8ba0a4] text-white text-[11px] uppercase tracking-widest px-6 py-3 text-center hover:opacity-90 transition"
                  >
                    Volver
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-[#183e4b]/70">
                  Tip: presioná <span className="font-semibold">ESC</span> para
                  volver al inicio.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}