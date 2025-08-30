import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const QRDesigner = dynamic(() => import("@/components/QRDesigner"), {
  ssr: false,
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen p-6 md:p-10`}
    >
      <main className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">QR Code Generator</h1>
            <p className="text-sm text-black/60 dark:text-white/60">
              Generate QR codes for text, links, phone, email, Wi‑Fi with custom shapes, gradients, and logos.
            </p>
          </div>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noreferrer"
            className="text-sm opacity-60 hover:opacity-100"
          >
            Built with Next.js
          </a>
        </header>

        <QRDesigner />
      </main>
    </div>
  );
}
