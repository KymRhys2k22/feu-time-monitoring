import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function RecentActivity({
  studentNumber,
  section,
  logs = [],
  isLoading = false,
}) {
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const prevLengthRef = useRef(0);

  // Effect to process logs when they change
  useEffect(() => {
    const processLogs = () => {
      const parsedEvents = [];

      logs.forEach((row, index) => {
        if (!row.date) return;

        const dateStr = row.date; // MM-DD-YYYY (e.g. "03-05-2026")

        // NOTE: new Date("MM-DD-YYYY HH:mm") is non-standard and returns NaN in
        // many browsers. We must parse the parts manually.
        const parseDateTime = (timeStr) => {
          if (!timeStr) return null;
          try {
            const dateParts = dateStr.split("-");
            if (dateParts.length !== 3) return null;
            const month = parseInt(dateParts[0], 10);
            const day = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);

            const timeParts = String(timeStr).split(":");
            if (timeParts.length < 2) return null;
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);

            const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
            return isNaN(date.getTime()) ? null : date;
          } catch (e) {
            console.error("Date parse error", e);
            return null;
          }
        };

        if (row.in) {
          const timeInDate = parseDateTime(row.in);
          if (timeInDate && !isNaN(timeInDate)) {
            parsedEvents.push({
              id: `in-${index}`,
              type: "TIME_IN",
              studentName: row.name,
              section: row.section,
              studentNumber: row.student_number,
              timestamp: timeInDate,
              status: "Recorded",
            });
          }
        }

        if (row.out) {
          const timeOutDate = parseDateTime(row.out);
          if (timeOutDate && !isNaN(timeOutDate)) {
            parsedEvents.push({
              id: `out-${index}`,
              type: "TIME_OUT",
              studentName: row.name,
              section: row.section,
              studentNumber: row.student_number,
              timestamp: timeOutDate,
              status: "Recorded",
            });
          }
        }
      });

      parsedEvents.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(parsedEvents);
    };

    processLogs();
  }, [logs]);

  // Animate header when it mounts
  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: -10,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    },
    { scope: containerRef },
  );

  // Animate activity cards whenever the displayed list changes
  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".activity-card");
      if (!cards || cards.length === 0) return;

      const currentLength = cards.length;
      const prevLength = prevLengthRef.current;

      if (currentLength > prevLength) {
        // Animate only newly-added cards (stagger from the top)
        gsap.from(cards, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
        });
      }

      prevLengthRef.current = currentLength;
    },
    { scope: containerRef, dependencies: [activities, showAll] },
  );

  // Filter activities
  const filteredActivities = activities.filter((log) => {
    if (!studentNumber || !section) return false;
    const matchNumber =
      log.studentNumber &&
      String(log.studentNumber).trim() === String(studentNumber).trim();
    const matchSection = log.section && log.section.trim() === section.trim();
    return matchNumber && matchSection;
  });

  const displayedActivities = showAll
    ? filteredActivities
    : filteredActivities.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (filteredActivities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>
          {!studentNumber || !section
            ? "Enter your details to view activity"
            : "No records found for this student"}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <h4
        ref={headerRef}
        className="text-sm font-bold text-slate-900 dark:text-white mb-2">
        Recent Activity
      </h4>

      {displayedActivities.map((log) => (
        <div
          key={log.id}
          className="activity-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
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
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900 dark:text-white capitalize">
                  {log.studentName}
                </p>
                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {log.section || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col text-base text-slate-500 dark:text-slate-400">
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
        </div>
      ))}

      {filteredActivities.length > 3 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary text-sm font-medium hover:underline">
            {showAll ? "View Less" : "View All"}
          </button>
        </div>
      )}
    </div>
  );
}
