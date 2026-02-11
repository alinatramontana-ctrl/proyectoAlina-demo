import type { Metadata } from "next";
import Header from "@/app/components/Header";
import BackButton from "@/app/components/BackButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edificio Demo",
  description: "Showroom inmobiliario interactivo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        <Header />
        {children}
        <BackButton />
      </body>
    </html>
  );
}
