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
        "font-extrabold flex items-center gap-2.5 transition-transform hover:scale-[1.02] duration-150",
        fontSize === "xl" ? "text-xl" : "text-2xl"
      )}
      href="/"
    >
      <div className="rounded-xl bg-gradient-to-tr from-primary to-orange-400 p-2 shadow-sm shadow-primary/30 flex items-center justify-center">
        <ZapIcon size={iconSize} className="stroke-white fill-white" />
      </div>
      <div className="flex items-center tracking-tight font-sans">
        <span className="text-primary font-black">
          Scrape
        </span>
        <span className="text-foreground font-extrabold ml-0.5">Flow</span>
      </div>
    </Link>
  );
}

export default Logo;
