import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

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

export default function DesignerPage() {
  const { status } = useSession();
  return (
    <div className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen`}>
      <main className="mx-auto max-w-6xl px-6 md:px-10 py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">QR Code Designer</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Generate QR codes for text, links, phone, email, Wi‑Fi with custom shapes, gradients, and logos.
          </p>
        </div>
        <QRDesigner />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: { destination: "/auth/signin", permanent: false },
    };
  }

  return { props: { session } };
}

