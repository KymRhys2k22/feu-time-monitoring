import React, { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { LogIn, LogOut, Loader2, User } from "lucide-react";
import { api } from "../services/api";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await api.getLogs();
        const parsedEvents = [];

        data.forEach((row, index) => {
          // Row format: { NAME, SECTION, IN, OUT, DATE }
          // DATE example: "12-12-2026"
          // IN/OUT example: "12:00" or "1:23"

          if (!row.DATE) return;

          const dateStr = row.DATE; // MM-DD-YYYY

          // Helper to combine date and time string into a Date object
          const parseDateTime = (timeStr) => {
            if (!timeStr) return null;
            try {
              // Parse "MM-DD-YYYY HH:mm" or similar
              // Adjusting for potential slight variations if needed, but assuming strictness for now
              // Assuming time is in 24h or 12h? The example "1:23" suggests 12h without AM/PM or 24h.
              // Let's safe-guard. If input is "1:23", is it 1:23 AM or 13:23?
              // The example input "12:00" -> "1:23" suggests sequential.
              // Standard inputs usually vary. Let's try flexible parsing or combining strings.
              const dateTimeStr = `${dateStr} ${timeStr}`;
              // Try parsing with known format.
              // If "1:23" is 1:23 AM.
              // Using native date parsing might be easier for "MM-DD-YYYY HH:mm"
              return new Date(dateTimeStr);
            } catch (e) {
              console.error("Date parse error", e);
              return null;
            }
          };

          // Process TIME IN
          if (row.IN) {
            const timeInDate = parseDateTime(row.IN);
            if (timeInDate && !isNaN(timeInDate)) {
              parsedEvents.push({
                id: `in-${index}`,
                type: "TIME_IN",
                studentName: row.NAME,
                section: row.SECTION,
                studentNumber: row["STUDENT NUMBER"],
                timestamp: timeInDate,
                status: "Recorded", // Default status, we don't have enough logic for 'Late' without schedule
              });
            }
          }

          // Process TIME OUT
          if (row.OUT) {
            const timeOutDate = parseDateTime(row.OUT);
            if (timeOutDate && !isNaN(timeOutDate)) {
              parsedEvents.push({
                id: `out-${index}`,
                type: "TIME_OUT",
                studentName: row.NAME,
                section: row.SECTION,
                studentNumber: row["STUDENT NUMBER"],
                timestamp: timeOutDate,
                status: "Recorded",
              });
            }
          }
        });

        // Sort by timestamp descending (newest first)
        parsedEvents.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(parsedEvents);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
        Recent Activity
      </h4>

      {activities.map((log) => (
        <div
          key={log.id}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                log.type === "TIME_IN"
                  ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
              }`}>
              {log.type === "TIME_IN" ? (
                <LogIn className="w-6 h-6" />
              ) : (
                <LogOut className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white capitalize">
                {log.studentName}
              </p>
              <div className="flex flex-col text-sm text-slate-500 dark:text-slate-400">
                {log.studentNumber && (
                  <span className="text-xs text-slate-400 font-mono mb-0.5">
                    #{log.studentNumber}
                  </span>
                )}
                <div className="flex items-center space-x-2">
                  <span>
                    {log.type === "TIME_IN" ? "Timed In" : "Timed Out"}
                  </span>
                  <span>•</span>
                  <span>{format(log.timestamp, "MMM d, h:mm a")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300`}>
              {log.section || "N/A"}
            </span>
          </div>
        </div>
      ))}

      {activities.length > 5 && (
        <div className="text-center pt-2">
          <button className="text-primary text-sm font-medium hover:underline">
            View All
          </button>
        </div>
      )}
    </div>
  );
}
