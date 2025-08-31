import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NavBar />
        <Component {...pageProps} />
        <Toaster richColors />
      </ThemeProvider>
    </SessionProvider>
  );
}
