"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // No mostrar en la Home
  if (pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="fixed bottom-6 right-6 z-[60] rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-widest text-white backdrop-blur hover:bg-white hover:text-black transition"
    >
      ← Volver
    </button>
  );
}
