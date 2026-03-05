import React from "react";
import { Calculator } from "lucide-react";

const fabKeyframes = `
@keyframes fab-pop-in {
  0%   { opacity: 0; transform: scale(0.5); }
  70%  { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
`;

export default function FAB({ onClick }) {
  return (
    <>
      <style>{fabKeyframes}</style>
      <button
        onClick={onClick}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,

          borderRadius: "50%",
          width: "3.25rem",
          height: "3.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          border: "none",
          outline: "none",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          animation: "fab-pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          animationDelay: "0.6s",
        }}
        className="bg-gradient-to-tr from-primary to-secondary hover:from-secondary hover:to-secondary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        aria-label="Open Calculator">
        <Calculator size={22} />
      </button>
    </>
  );
}
