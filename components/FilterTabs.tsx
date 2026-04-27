"use client";

import { cn } from "@/lib/utils";
import { useTaskStore, type TaskFilter } from "@/store/useTaskStore";

const FILTERS: { label: string; value: TaskFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function FilterTabs() {
  const filter = useTaskStore((s) => s.filter);
  const setFilter = useTaskStore((s) => s.setFilter);
  const activeCount = useTaskStore((s) => s.activeCount);

  return (
    <div className="flex mx-auto max-w-xl py-2 pt-20 items-center justify-between w-full">
      <div className="flex items-center gap-1 text-sm">
        {FILTERS.map((f, i) => (
          <span key={f.value} className="flex items-center gap-3">
            <button
              onClick={() => setFilter(f.value)}
              className={cn(
                "font-medium transition-colors",
                filter === f.value
                  ? "text-slate-900 dark:text-white"
                  : "text-[#6A7282] hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {f.label}
            </button>
            {i < FILTERS.length - 1 && (
              <span className="text-slate-300 dark:text-slate-600">|</span>
            )}
          </span>
        ))}
      </div>

      <span className="text-[#6A7282] text-sm">
        {activeCount()} task{activeCount() !== 1 ? "s" : ""} left
      </span>
    </div>
  );
}
