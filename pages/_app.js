import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const hideNav = router.pathname === "/"; // no header on landing
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
