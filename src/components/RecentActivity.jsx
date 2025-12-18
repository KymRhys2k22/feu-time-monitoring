import React from "react";
import { format } from "date-fns";
import { LogIn, LogOut } from "lucide-react";

export default function RecentActivity({ logs }) {
  if (logs.length === 0) {
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

      {logs.map((log) => (
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
              <p className="font-bold text-slate-900 dark:text-white">
                {log.type === "TIME_IN" ? "Timed In" : "Timed Out"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {format(new Date(log.timestamp), "Today, hh:mm a")}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                log.status === "On Time"
                  ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              }`}>
              {log.status || "On Time"}
            </span>
          </div>
        </div>
      ))}

      <div className="text-center pt-2">
        <button className="text-primary text-sm font-medium hover:underline">
          View All
        </button>
      </div>
    </div>
  );
}
