import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <h2 className="text-primary font-medium tracking-wide text-sm mb-2 uppercase">
        Today's Attendance
      </h2>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        {format(time, "EEEE, MMM d")}
      </h3>

      <div className="flex items-center space-x-2">
        <div className="flex flex-col items-center">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl w-24 h-24 flex items-center justify-center mb-2 transition-colors">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              {format(time, "hh")}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
            Hours
          </span>
        </div>

        <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 pb-8">
          :
        </span>

        <div className="flex flex-col items-center">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl w-24 h-24 flex items-center justify-center mb-2 transition-colors">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              {format(time, "mm")}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
            Minutes
          </span>
        </div>

        <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 pb-8">
          :
        </span>

        <div className="flex flex-col items-center">
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-primary rounded-2xl w-24 h-24 flex items-center justify-center mb-2 transition-colors">
            <span className="text-4xl font-bold text-primary">
              {format(time, "ss")}
            </span>
          </div>
          <span className="text-xs font-medium text-primary uppercase">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
}
