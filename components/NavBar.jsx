"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-black/30 backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">QR Code Generator</span>
        </div>
        {session && (
          <div className="flex items-center gap-3">
            <Avatar src={session?.user?.image} fallback={session?.user?.name?.[0] || "?"} />
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium leading-tight">{session?.user?.name}</div>
              <div className="text-xs opacity-70 leading-tight">{session?.user?.email}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
          </div>
        )}
      </div>
    </header>
  );
}

