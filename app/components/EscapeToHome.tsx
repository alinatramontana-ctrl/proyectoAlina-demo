"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EscapeToHome() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
