"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation("common");
  const onDesigner = pathname === "/designer";
  const onQrs = pathname === "/qrs";

  const changeLocale = (e) => {
    const locale = e.target.value;
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-black/30 backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
        {/* Left: brand + nav */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-base font-semibold">
            {t("brand")}
          </Link>
          <nav className="hidden sm:flex items-center gap-2 ml-4">
            {pathname !== "/" && (
              <Link href="/" className="text-sm opacity-80 hover:opacity-100">
                {t("nav.home")}
              </Link>
            )}
            {!onDesigner && (
              <Link href="/designer" className="text-sm opacity-80 hover:opacity-100">
                {t("nav.designer")}
              </Link>
            )}
          </nav>
        </div>

        {/* Right: auth */}
        <div className="flex items-center gap-3">
          <select
            value={router.locale}
            onChange={changeLocale}
            className="border rounded text-sm p-1 bg-transparent"
          >
            {router.locales?.map((loc) => (
              <option key={loc} value={loc}>
                {loc.toUpperCase()}
              </option>
            ))}
          </select>
          {session ? (
            <>
              <Avatar
                src={session?.user?.image}
                fallback={session?.user?.name?.[0] || "?"}
              />
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium leading-tight">{session?.user?.name}</div>
                <div className="text-xs opacity-70 leading-tight">{session?.user?.email}</div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {!onQrs && (
                  <Link href="/qrs">
                    <Button variant="outline" size="sm">{t("nav.myQrs")}</Button>
                  </Link>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => signIn()}>
              {t("nav.signIn")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
