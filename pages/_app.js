import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { appWithTranslation } from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  // Hide NavBar on landing and all embeddable preview routes
  const hideNav = router.pathname === "/" || router.pathname.startsWith("/view/");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored =
      localStorage.getItem("locale") ||
      document.cookie
        .split("; ")
        .find((c) => c.startsWith("NEXT_LOCALE="))
        ?.split("=")[1];
    if (stored && stored !== router.locale) {
      router.replace(router.pathname, router.asPath, { locale: stored });
    }
  }, [router]);
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className={`${geistSans.variable} ${geistMono.variable} font-sans `}>
          {!hideNav && <NavBar />}
          <Component {...pageProps} />
          <Toaster richColors />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(App, i18nConfig);
