import { useEffect, useRef } from "react";
import { saveSignalFeed } from "../services/signalService";

// Persists signal-feed companies to MongoDB once a search has results.
export default function usePersistSignalFeedSearch(query, items) {
  const lastSaved = useRef("");

  useEffect(() => {
    const q = (query || "").trim();
    if (!q || !items?.length) return;

    const signature = `${q}::${items.map((i) => i.company).join("|")}`;
    if (lastSaved.current === signature) return;

    const timer = setTimeout(async () => {
      try {
        await saveSignalFeed(q);
        lastSaved.current = signature;
      } catch (err) {
        console.error("Could not save signal feed to database:", err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [query, items]);
}
