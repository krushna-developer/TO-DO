"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PhotoSearchProps {
  value:       string;
  onChange:    (v: string) => void;
  resultCount: number;
  totalCount:  number;
  isLoading:   boolean;
}

export default function PhotoSearch({
  value, onChange, resultCount, totalCount, isLoading,
}: PhotoSearchProps) {
  return (
    <div className="flex flex-col w-full max-w-3xl  sm:flex-row sm:items-center gap-3 pb-5">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by title…"
          className="pl-9 pr-9 bg-white dark:bg-[#1e2d42] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-sky-500 h-10 transition-colors duration-300"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isLoading && (
        <p className="text-slate-500 dark:text-slate-400 text-xs shrink-0 transition-colors duration-300">
          {value
            ? `${resultCount} of ${totalCount} results`
            : `${totalCount.toLocaleString()} photos`}
        </p>
      )}
    </div>
  );
}
