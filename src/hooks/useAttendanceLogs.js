import { useState, useCallback, useRef } from "react";
import { api } from "../services/api";

export const useAttendanceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pollingRef = useRef(null);

  // Simple fetch without comparison
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Polls for changes until different data is found or timeout
  const triggerPolling = useCallback(() => {
    // Clear any existing poll
    if (pollingRef.current) clearInterval(pollingRef.current);

    let attempts = 0;
    const maxAttempts = 15; // 15 * 2s = 30s timeout
    const intervalTime = 2000;

    // We need the *current* state to compare against, but inside setInterval closures are stale.
    // Instead of comparing, we can just fetch and update.
    // Optimization: ONLY update state if data changed to avoid re-renders?
    // Or just let it update.
    // Requirement: "If the new data is identical to the old data, continue refreshing (polling)... If the new data is different, update the component state and stop the refresh process."

    // To implement "stop if different", we need to know what the "old" data was.
    // We can capture it at start of polling.

    // We'll trust that 'logs' in the component scope might be stale if we just used it directly,
    // but we can fetch the current version once before starting to poll?
    // Better: Helper function to get current data signature.

    // Actually, simpler approach for this "after submit" scenario:
    // We expect a NEW entry. So if the length increases or top entry changes, we stop.
    // But other students might be logging in too.
    // Let's just compare JSON string of the whole dataset or just the count + last entry.

    // Let's fetch once to get baseline (or rely on what we have if we assume it's up to date).
    // Safest is to fetch baseline first.

    // To properly compare against "current" state without stale closures, we can use a functional state update?
    // No, we need to decide whether to *continue* polling.

    // Start by fetching baseline (current server state) or assume current 'logs' state is the baseline?
    // Since 'logs' is updated via fetchLogs, it might be correct.
    // We'll do an immediate fetch to establish baseline if we want to be sure, OR just start polling and compare to the *first* poll result?
    // Usually "after submit", we want to see the change.

    // Strategy:
    // 1. Fetch immediately. Store as baseline.
    // 2. Start Interval.
    // 3. In interval: Fetch. Compare to baseline.
    //    If different -> Update State, Clear Interval.
    //    If same -> Continue (until max attempts).

    const run = async () => {
      // Initial fetch to get baseline
      // Note: We might want to skip this if we trust `logs` state, but `logs` might be empty initially.
      // Let's do a fetch.
      let currentDataStr = "";
      try {
        const initial = await api.getLogs();
        currentDataStr = JSON.stringify(initial);
        // We might want to update the UI with this initial fetch too, just in case.
        setLogs(initial);
      } catch (e) {
        console.error("Initial poll fetch failed", e);
        return;
      }

      pollingRef.current = setInterval(async () => {
        attempts++;
        if (attempts > maxAttempts) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          return;
        }

        try {
          const newData = await api.getLogs();
          const newDataStr = JSON.stringify(newData);

          if (newDataStr !== currentDataStr) {
            // Data changed!
            setLogs(newData);
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, intervalTime);
    };

    run();
  }, []);

  return { logs, isLoading, fetchLogs, triggerPolling };
};
