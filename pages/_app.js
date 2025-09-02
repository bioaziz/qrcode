import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

export default (App);
