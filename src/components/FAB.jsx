import React from "react";
import { Calculator } from "lucide-react";

export default function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-tr from-primary to-secondary hover:from-secondary hover:to-secondary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
      aria-label="Open Calculator">
      <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
    </button>
  );
}
