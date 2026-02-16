"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/requests", label: "제작 요청" },
  { href: "/market", label: "SaaS 거래소" },
];

const AUTH_NAV = [
  { href: "/dashboard/requests", label: "내 요청" },
  { href: "/dashboard/proposals", label: "내 제안" },
  { href: "/inbox", label: "메시지" },
];

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <Zap className="h-5 w-5 text-primary" />
          <span>VibeExchange</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground font-medium" : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
          {user && AUTH_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.startsWith(item.href) ? "text-foreground font-medium" : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link href="/sell/new">
                <Button size="sm">판매 등록</Button>
              </Link>
              <Link href="/requests/new">
                <Button size="sm" variant="outline">제작 요청</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">로그인</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden ml-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t p-4 space-y-3 bg-background">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="block text-sm py-1" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {user && AUTH_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="block text-sm py-1" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t space-y-2">
            {user ? (
              <>
                <Link href="/sell/new" className="block">
                  <Button size="sm" className="w-full">판매 등록</Button>
                </Link>
                <Button size="sm" variant="ghost" className="w-full" onClick={handleSignOut}>로그아웃</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="block">
                  <Button size="sm" variant="ghost" className="w-full">로그인</Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button size="sm" className="w-full">회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
