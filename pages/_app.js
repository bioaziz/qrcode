import "@/styles/globals.css";
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { appWithTranslation } from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";

function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const hideNav = router.pathname === "/"; // no header on landing

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    Coloris.init();
  }, []);
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {!hideNav && <NavBar />}
        <Component {...pageProps} />
        <Toaster richColors />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(App, i18nConfig);
