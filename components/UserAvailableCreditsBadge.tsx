"use client";

import { getAvailableCredits } from "@/actions/billings";
import { useQuery } from "@tanstack/react-query";
import { Coins, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactCountUpWrapper from "./ReactCountUpWrapper";

function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ["userAvailableCredits"],
    queryFn: () => getAvailableCredits(),
    refetchInterval: 30 * 1000,
    staleTime: 10 * 1000,
  });

  return (
    <Link
      href="/billing"
      className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-all duration-150 group shadow-sm"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1 rounded-md bg-muted text-foreground group-hover:scale-105 transition-transform">
          <Coins size={15} />
        </div>
        <div className="flex flex-col text-left truncate">
          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-tight">
            Credits
          </span>
          <span className="text-xs font-bold text-foreground leading-tight">
            {query.isLoading && <Loader2 className="w-3 h-3 animate-spin mt-0.5" />}
            {!query.isLoading && typeof query.data === "number" && (
              <ReactCountUpWrapper value={query.data} />
            )}
            {!query.isLoading && query.data === undefined && "0"}
          </span>
        </div>
      </div>

      <div className="p-1 rounded bg-muted text-foreground border border-border text-[10px] font-medium group-hover:bg-foreground group-hover:text-background transition">
        <PlusIcon size={12} />
      </div>
    </Link>
  );
}

export default UserAvailableCreditsBadge;
