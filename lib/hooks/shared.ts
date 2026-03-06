"use client";

import { useState, useEffect, useCallback } from "react";

export interface UseDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSupabaseQuery<T>(
  fetcher: () => Promise<T>,
  defaultValue: T,
  deps: unknown[] = []
): UseDataResult<T> {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      console.error("Supabase query error:", err);
      setError(err instanceof Error ? err.message : "Greška pri dohvaćanju podataka");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetchFn(); }, [fetchFn]);
  return { data, loading, error, refetch: fetchFn };
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}
