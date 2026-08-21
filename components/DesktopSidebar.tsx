"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/data";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";
import { cn } from "@/lib/utils";
import { BookOpenIcon, ExternalLinkIcon, SparklesIcon, ZapIcon } from "lucide-react";

function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col min-w-[260px] max-w-[260px] h-screen bg-card/40 dark:bg-[#0c0a09]/80 backdrop-blur-md border-r border-border justify-between select-none">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="flex items-center px-6 py-5 border-b border-border/50">
          <Logo fontSize="xl" iconSize={18} />
        </div>

        {/* Credit Badge */}
        <div className="px-4 py-4">
          <UserAvailableCreditsBadge />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 py-1">
            Menu
          </span>
          {routes.map((route) => {
            const isActive =
              pathname === route.href ||
              (route.href !== "/home" && pathname.startsWith(route.href));

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                <route.icon
                  size={18}
                  className={cn(
                    "transition-transform duration-150 group-hover:scale-110 shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                <span className="truncate">{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-border/50 flex flex-col gap-3">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <SparklesIcon size={14} />
            <span>ScrapeFlow Cloud</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Automated scraping engine with AI semantic parsing & cron runner.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Engine Online
          </span>
          <span className="font-mono text-[10px] opacity-70">v2.1.0</span>
        </div>
      </div>
    </aside>
  );
}

export default DesktopSidebar;
