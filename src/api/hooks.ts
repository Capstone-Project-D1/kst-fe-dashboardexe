import { useEffect, useMemo, useState } from "react";
import { apiClient } from "./config";

interface PageContainer<T> {
  offset: number;
  limit: number;
  hasNext: boolean;
  total?: number;
  items: T[];
}

export function useApiData<T>(
  path: string,
  query?: Record<string, unknown>,
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const key = useMemo(() => JSON.stringify(query ?? {}), [query]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    apiClient
      .get<T>(path, query)
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat data");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, key, enabled]);

  return { data, isLoading, error };
}

export function usePageData<T>(path: string, query?: Record<string, unknown>) {
  const { data, isLoading, error } = useApiData<PageContainer<T>>(path, query);
  return {
    items: data?.items ?? [],
    page: data,
    isLoading,
    error,
  };
}
