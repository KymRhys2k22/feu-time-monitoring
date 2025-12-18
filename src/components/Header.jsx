import React from "react";
import { History, Menu, Moon, Sun } from "lucide-react";

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="flex items-center justify-between py-4 mb-8">
      <button className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
      </button>
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">
        Work Immersion Log
      </h1>
      <div className="flex items-center space-x-1">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          {theme === "dark" ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-slate-900" />
          )}
        </button>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <History className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
      </div>
    </header>
  );
}
