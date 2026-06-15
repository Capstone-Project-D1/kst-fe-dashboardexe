import { useEffect, useMemo, useState } from "react";
import { ApiError, apiClient } from "./config";

interface PageContainer<T> {
  offset: number;
  limit: number;
  hasNext: boolean;
  total?: number;
  items: T[];
}

type PagePayload<T> = PageContainer<T> | T[] | unknown;

function hasItems<T>(payload: unknown): payload is PageContainer<T> {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      Array.isArray((payload as PageContainer<T>).items),
  );
}

function asRecord(payload: unknown): Record<string, unknown> | null {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : null;
}

function pageFromArray<T>(items: T[]): PageContainer<T> {
  return {
    offset: 0,
    limit: items.length,
    hasNext: false,
    total: items.length,
    items,
  };
}

function findPageContainer<T>(payload: unknown, depth = 0): PageContainer<T> | null {
  if (depth > 5) return null;

  if (Array.isArray(payload)) {
    return pageFromArray(payload as T[]);
  }

  if (hasItems<T>(payload)) return payload;

  const record = asRecord(payload);
  if (!record) return null;

  for (const key of ["data", "response"]) {
    if (key in record) {
      const nested = findPageContainer<T>(record[key], depth + 1);
      if (nested) return nested;
    }
  }

  return null;
}

export function parsePageContainer<T>(payload: PagePayload<T> | null): PageContainer<T> | null {
  return findPageContainer<T>(payload);
}

export function useApiData<T>(
  path: string,
  query?: Record<string, unknown>,
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const key = useMemo(() => JSON.stringify(query ?? {}), [query]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setErrorStatus(null);

    apiClient
      .get<T>(path, query)
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat data");
          setErrorStatus(err instanceof ApiError ? err.status : null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, key, enabled]);

  return { data, isLoading, error, errorStatus };
}

export function usePageData<T>(path: string, query?: Record<string, unknown>) {
  const { data, isLoading, error, errorStatus } = useApiData<PagePayload<T>>(path, query);
  const page = parsePageContainer<T>(data);
  const parseError =
    !isLoading && !error && data !== null && !page
      ? "Format response tidak dikenali"
      : null;

  return {
    items: page?.items ?? ([] as T[]),
    page,
    isLoading,
    error: error ?? parseError,
    errorStatus,
  };
}
