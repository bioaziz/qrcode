import { useRouter } from "next/router";

export const messages = {
  en: {
    home: "Home",
    designer: "Designer",
    signIn: "Sign in",
    signOut: "Sign out",
    myQrs: "My QRs",
    appName: "Genius QR",
  },
  es: {
    home: "Inicio",
    designer: "Diseñador",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    myQrs: "Mis QR",
    appName: "Genius QR",
  },
};

export const supportedLocales = Object.keys(messages);

export function useMessages() {
  const { locale } = useRouter();
  return messages[locale] || messages.en;
}
