"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";

// Language configuration with flags and labels
const LANGUAGE_CONFIG = {
  en: { flag: "🇺🇸", label: "English", code: "EN" },
  es: { flag: "🇪🇸", label: "Español", code: "ES" },
  fr: { flag: "🇫🇷", label: "Français", code: "FR" },
  de: { flag: "🇩🇪", label: "Deutsch", code: "DE" },
  it: { flag: "🇮🇹", label: "Italiano", code: "IT" },
  pt: { flag: "🇧🇷", label: "Português", code: "PT" },
  ja: { flag: "🇯🇵", label: "日本語", code: "JA" },
  ko: { flag: "🇰🇷", label: "한국어", code: "KO" },
  zh: { flag: "🇨🇳", label: "中文", code: "ZH" },
  ar: { flag: "🇸🇦", label: "العربية", code: "AR" },
  ru: { flag: "🇷🇺", label: "Русский", code: "RU" },
  hi: { flag: "🇮🇳", label: "हिन्दी", code: "HI" },
};

function LanguageSelector({ currentLocale, locales, onLocaleChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGE_CONFIG[currentLocale] || LANGUAGE_CONFIG.en;

  const handleLocaleSelect = (locale) => {
    onLocaleChange(locale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/70 transition-colors"
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLang.code}</span>
        <ChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/15 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-black/5 dark:border-white/10 mb-2">
              <Globe className="size-3" />
              Select Language
            </div>
            <div className="max-h-64 overflow-y-auto">
              {locales.map((locale) => {
                const lang = LANGUAGE_CONFIG[locale] || { flag: "🌐", label: locale, code: locale.toUpperCase() };
                const isSelected = locale === currentLocale;

                return (
                  <button
                    key={locale}
                    onClick={() => handleLocaleSelect(locale)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isSelected 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{lang.label}</div>
                      <div className="text-xs opacity-70">{lang.code}</div>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = router?.pathname || "";
  const { t, i18n } = useTranslation("common");

  const onDesigner = pathname === "/designer";
  const onQrs = pathname === "/qrs";

  // Use a stable default so SSR/CSR always match even if i18n isn't ready yet
  const brand = t("brand", "QR Generator");

  const changeLocale = (locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }
    // preserve current URL (including query) and replace history entry
    router.replace(router.asPath, undefined, { locale });
  };

  const hasLocales = Array.isArray(router?.locales) && router.locales.length > 0;
  const currentLocale = router?.locale || (hasLocales ? router.locales[0] : "en");

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Left: brand + nav */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {brand}
          </Link>
          <nav className="hidden sm:flex items-center gap-1 ml-6">
            {pathname !== "/" && (
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {t("nav.home", "Home")}
              </Link>
            )}
            {!onDesigner && (
              <Link
                href="/designer"
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {t("nav.designer", "Designer")}
              </Link>
            )}
          </nav>
        </div>

        {/* Right: locale + auth */}
        <div className="flex items-center gap-4">
          {hasLocales && (
            <LanguageSelector
              currentLocale={currentLocale}
              locales={router.locales}
              onLocaleChange={changeLocale}
            />
          )}

          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <Avatar
                  src={session?.user?.image}
                  fallback={session?.user?.name?.[0] || "?"}
                  className="w-8 h-8"
                />
                <div className="text-right">
                  <div className="text-sm font-medium leading-tight">{session?.user?.name}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{session?.user?.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!onQrs && (
                  <Link href="/qrs">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                      {t("nav.myQrs", "My QRs")}
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <span className="hidden sm:inline">{t("nav.signOut", "Sign out")}</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => signIn()}>
              {t("nav.signIn", "Sign in")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}