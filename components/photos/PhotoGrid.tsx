"use client";

import { useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhotoCard from "@/components/photos/PhotoCard";
import PhotoSearch from "@/components/photos/PhotoSearch";
import { usePhotos } from "@/hooks/usePhotos";
import { useDebounce } from "@/hooks/useDebounce";

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white dark:bg-[#1e2d42] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-200 dark:bg-slate-800" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-2.5 bg-slate-200 dark:bg-white/5 rounded-full w-full" />
        <div className="h-2.5 bg-slate-200 dark:bg-white/5 rounded-full w-3/4" />
        <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full w-1/4 mt-1" />
      </div>
    </div>
  );
}

export default function PhotoGrid() {
  const [query, setQuery] = useState("");
  const debouncedQuery    = useDebounce(query, 400);

  const { photos, allPhotos, isLoading, isLoadingMore, error, hasMore, loadMore, retry } =
    usePhotos(debouncedQuery);

  return (
    <div className="flex flex-col gap-5 w-full">
      <PhotoSearch
        value={query}
        onChange={setQuery}
        resultCount={photos.length}
        totalCount={allPhotos.length}
        isLoading={isLoading}
      />

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">{error}</p>
          <Button variant="outline" size="sm" onClick={retry}
            className="gap-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5">
            <RefreshCw className="w-4 h-4" /> Try again
          </Button>
        </div>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
            No photos found for &quot;{debouncedQuery}&quot;
          </p>
          <button onClick={() => setQuery("")}
            className="text-sky-400 hover:text-sky-300 text-xs transition-colors">
            Clear search
          </button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && photos.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo) => <PhotoCard key={photo.id} photo={photo} />)}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={loadMore} disabled={isLoadingMore}
                className="gap-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white min-w-[140px] transition-colors duration-300">
                {isLoadingMore
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
                  : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
