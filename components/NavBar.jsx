"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMessages } from "@/lib/i18n";

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useMessages();
  const path = router?.pathname || "";
  const onDesigner = path === "/designer";
  const onQrs = path === "/qrs";

  function changeLocale(locale) {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
      document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    }
    router.push(router.pathname, router.asPath, { locale });
  }

  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-black/30 backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-base font-semibold">{t.appName}</Link>
          <nav className="hidden sm:flex items-center gap-2 ml-4">
            {path !== "/" && <Link href="/" className="text-sm opacity-80 hover:opacity-100">{t.home}</Link>}
            {!onDesigner && <Link href="/designer" className="text-sm opacity-80 hover:opacity-100">{t.designer}</Link>}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Select value={router.locale} onValueChange={changeLocale}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
          {session ? (
            <>
              <Avatar src={session?.user?.image} fallback={session?.user?.name?.[0] || "?"} />
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium leading-tight">{session?.user?.name}</div>
                <div className="text-xs opacity-70 leading-tight">{session?.user?.email}</div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {!onQrs && (
                  <Link href="/qrs"><Button variant="outline" size="sm">{t.myQrs}</Button></Link>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => signOut()}>{t.signOut}</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => signIn()}>{t.signIn}</Button>
          )}
        </div>
      </div>
    </header>
  );
}
