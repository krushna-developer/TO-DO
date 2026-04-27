import { useState, useEffect, useCallback } from "react";
import { Photo } from "@/types/photo";

const PAGE_SIZE = 24;
const API_URL   = "https://jsonplaceholder.typicode.com/photos";

interface UsePhotosReturn {
  photos:        Photo[];
  allPhotos:     Photo[];
  isLoading:     boolean;
  isLoadingMore: boolean;
  error:         string | null;
  hasMore:       boolean;
  loadMore:      () => void;
  retry:         () => void;
}

export function usePhotos(query: string): UsePhotosReturn {
  const [allPhotos,     setAllPhotos]     = useState<Photo[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [page,          setPage]          = useState(1);

  const fetchPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
      const data: Photo[] = await res.json();
      setAllPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  // reset pagination whenever search query changes
  useEffect(() => { setPage(1); }, [query]);

  const filtered = query.trim()
    ? allPhotos.filter((p) =>
        p.title.toLowerCase().includes(query.trim().toLowerCase())
      )
    : allPhotos;

  const photos  = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = photos.length < filtered.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    }, 300);
  };

  return { photos, allPhotos, isLoading, isLoadingMore, error, hasMore, loadMore, retry: fetchPhotos };
}