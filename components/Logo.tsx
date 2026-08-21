"use client";

import { cn } from "@/lib/utils";
import { ZapIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo({
  fontSize = "xl",
  iconSize = 18,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      className={cn(
        "font-extrabold flex items-center gap-2.5 transition-opacity hover:opacity-90 duration-150 select-none",
        fontSize === "xl" ? "text-xl" : "text-2xl"
      )}
      href="/"
    >
      <div className="rounded-lg bg-foreground text-background p-1.5 flex items-center justify-center shadow-sm">
        <ZapIcon size={iconSize} className="stroke-background fill-background" />
      </div>
      <div className="flex items-center tracking-tight font-sans">
        <span className="text-foreground font-black">
          Scrape
        </span>
        <span className="text-muted-foreground font-light ml-0.5">Flow</span>
      </div>
    </Link>
  );
}

export default Logo;
