import React from "react";
import { LogIn, LogOut } from "lucide-react";

export default function ActionButtons({ onTimeIn, onTimeOut, isLoading }) {
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={onTimeIn}
        disabled={isLoading}
        className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-900/20 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        <LogIn className="w-6 h-6" />
        <span>TIME IN</span>
      </button>

      <button
        onClick={onTimeOut}
        disabled={isLoading}
        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        <LogOut className="w-6 h-6" />
        <span>TIME OUT</span>
      </button>
    </div>
  );
}
