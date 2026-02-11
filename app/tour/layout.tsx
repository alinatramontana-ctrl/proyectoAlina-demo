import Script from "next/script";

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="/vendor/pannellum/pannellum.css"
      />

      <Script
        src="/vendor/pannellum/pannellum.js"
        strategy="afterInteractive"
      />

      {children}
    </>
  );
}
