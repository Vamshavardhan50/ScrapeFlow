"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/data";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col min-w-[250px] max-w-[250px] h-screen bg-background border-r border-border justify-between select-none">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="flex items-center px-5 py-4 border-b border-border">
          <Logo fontSize="xl" iconSize={16} />
        </div>

        {/* Credit Badge */}
        <div className="px-3.5 py-3">
          <UserAvailableCreditsBadge />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-2.5">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-2.5 py-1">
            Platform
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
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <route.icon
                  size={16}
                  className={cn(
                    "transition-transform duration-150 shrink-0",
                    isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="truncate">{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3.5 border-t border-border flex flex-col gap-2.5">
        <div className="p-2.5 rounded-lg bg-muted/60 border border-border text-xs flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-foreground">
            <SparklesIcon size={13} />
            <span>ScrapeFlow Cloud</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-snug">
            Puppeteer automation with AI semantic parsing & cron scheduling.
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            Engine Online
          </span>
          <span className="font-mono text-[9px] opacity-70">v2.1.0</span>
        </div>
      </div>
    </aside>
  );
}

export default DesktopSidebar;
