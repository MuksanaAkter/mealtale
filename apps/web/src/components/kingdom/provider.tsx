"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { KingdomState } from "@/lib/types";
import { api } from "@/lib/api/client";
import { useUI } from "@/store/ui";
const Context = createContext<{
  data: KingdomState;
  busy: boolean;
  mutate: (
    path: string,
    method: string,
    value?: unknown,
    message?: string,
  ) => Promise<boolean>;
  refresh: () => Promise<void>;
} | null>(null);
export function KingdomProvider({
  initial,
  children,
}: {
  initial: KingdomState;
  children: ReactNode;
}) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const notify = useUI((s) => s.notify);
  const refresh = useCallback(async () => {
    setData(await api<KingdomState>("state"));
  }, []);
  async function mutate(
    path: string,
    method: string,
    value?: unknown,
    message = "Your kingdom has been updated.",
  ) {
    if (busy) return false;
    setBusy(true);
    try {
      await api(path, method, value);
      await refresh();
      notify(message);
      return true;
    } catch (error) {
      notify(error instanceof Error ? error.message : "Please try again");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <Context.Provider value={{ data, busy, mutate, refresh }}>
      {children}
    </Context.Provider>
  );
}
export function useKingdom() {
  const value = useContext(Context);
  if (!value) throw new Error("Kingdom provider is missing");
  return value;
}
