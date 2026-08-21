"use client";

import { routes } from "@/lib/data";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon, SparklesIcon } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";
import { cn } from "@/lib/utils";

function MobileSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block md:hidden mr-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MenuIcon size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[85vw] max-w-[320px] p-5 flex flex-col justify-between"
          side="left"
        >
          <div className="flex flex-col gap-5">
            <Logo fontSize="xl" iconSize={18} />
            <UserAvailableCreditsBadge />
            <nav className="flex flex-col gap-1">
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
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <route.icon size={18} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                    {route.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs flex flex-col gap-1">
            <div className="flex items-center gap-1 text-primary font-bold">
              <SparklesIcon size={14} />
              <span>ScrapeFlow Cloud</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Automated visual scraping & AI parsing engine.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileSidebar;
