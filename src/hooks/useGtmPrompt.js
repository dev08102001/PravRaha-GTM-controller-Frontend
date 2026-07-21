import { useEffect, useState } from "react";

// Shared campaign-goal prompt state for dashboard widgets that should stay in sync.
export default function useGtmPrompt() {
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem("gtm:lastPrompt") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    const onPrompt = (e) => setQuery(e.detail || "");
    window.addEventListener("gtm:prompt", onPrompt);
    return () => window.removeEventListener("gtm:prompt", onPrompt);
  }, []);

  const clearPrompt = () => {
    setQuery("");
    try {
      localStorage.removeItem("gtm:lastPrompt");
      window.dispatchEvent(
        new CustomEvent("gtm:prompt", { detail: "" })
      );
    } catch {
      /* ignore */
    }
  };

  const applyPrompt = (next) => {
    const trimmed = (next || "").trim();
    setQuery(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem("gtm:lastPrompt", trimmed);
      } else {
        localStorage.removeItem("gtm:lastPrompt");
      }
      window.dispatchEvent(
        new CustomEvent("gtm:prompt", { detail: trimmed })
      );
    } catch {
      /* ignore */
    }
  };

  return { query, setQuery, clearPrompt, applyPrompt };
}
