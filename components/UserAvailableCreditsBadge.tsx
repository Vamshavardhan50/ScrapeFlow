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
      className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-150 group shadow-sm"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          <Coins size={16} />
        </div>
        <div className="flex flex-col text-left truncate">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-tight">
            Credits
          </span>
          <span className="text-sm font-extrabold text-foreground leading-tight">
            {query.isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mt-0.5" />}
            {!query.isLoading && typeof query.data === "number" && (
              <ReactCountUpWrapper value={query.data} />
            )}
            {!query.isLoading && query.data === undefined && "0"}
          </span>
        </div>
      </div>

      <div className="p-1 rounded-md bg-primary text-primary-foreground opacity-90 group-hover:opacity-100 transition">
        <PlusIcon size={13} />
      </div>
    </Link>
  );
}

export default UserAvailableCreditsBadge;
