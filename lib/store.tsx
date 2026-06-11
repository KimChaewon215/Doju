"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { Escape, Verdict } from "@/types";

interface AppState {
  userId: string;
  nickname: string;
  character: string;
  currentEscape: Escape | null;
  currentVerdict: Verdict | null;
  escapeHistory: Escape[];
}

interface AppContextValue extends AppState {
  setNickname: (n: string) => void;
  setCharacter: (c: string) => void;
  setCurrentEscape: (e: Escape | null) => void;
  setCurrentVerdict: (v: Verdict | null) => void;
  setEscapeHistory: (h: Escape[]) => void;
  resetCurrentEscape: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "doju_state";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    userId: "",
    nickname: "",
    character: "🏃",
    currentEscape: null,
    currentVerdict: null,
    escapeHistory: [],
  });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed }));
      } else {
        // Generate new userId on first visit
        setState((prev) => ({ ...prev, userId: uuidv4() }));
      }
    } catch {
      setState((prev) => ({ ...prev, userId: uuidv4() }));
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!state.userId) return;
    const { currentVerdict, ...toSave } = state;
    void currentVerdict; // suppress lint
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  const setNickname = useCallback((nickname: string) => {
    setState((prev) => ({ ...prev, nickname }));
  }, []);

  const setCharacter = useCallback((character: string) => {
    setState((prev) => ({ ...prev, character }));
  }, []);

  const setCurrentEscape = useCallback((currentEscape: Escape | null) => {
    setState((prev) => ({ ...prev, currentEscape }));
  }, []);

  const setCurrentVerdict = useCallback((currentVerdict: Verdict | null) => {
    setState((prev) => ({ ...prev, currentVerdict }));
  }, []);

  const setEscapeHistory = useCallback((escapeHistory: Escape[]) => {
    setState((prev) => ({ ...prev, escapeHistory }));
  }, []);

  const resetCurrentEscape = useCallback(() => {
    setState((prev) => ({ ...prev, currentEscape: null, currentVerdict: null }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setNickname,
        setCharacter,
        setCurrentEscape,
        setCurrentVerdict,
        setEscapeHistory,
        resetCurrentEscape,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}