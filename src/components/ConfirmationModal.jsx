import React, { useRef, useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  message,
  subMessage,
}) {
  const container = useRef(null);
  const [isRendered, setIsRendered] = useState(isOpen);

  // Sync state with prop during render to avoid effect flash (Safe if guarded)
  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  // Handle exit delay
  useEffect(() => {
    if (!isOpen && isRendered) {
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  // Auto close after 3 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // GSAP Animation
  useGSAP(
    () => {
      // If visible (isRendered is true)
      if (isRendered && container.current) {
        if (isOpen) {
          // Animate In: isOpen is true
          gsap.fromTo(
            container.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }
          );
        } else {
          // Animate Out: isOpen is false, but isRendered is still true (exit phase)
          gsap.to(container.current, {
            y: 50,
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
          });
        }
      }
    },
    { dependencies: [isOpen, isRendered], scope: container }
  );

  if (!isRendered) return null;

  return (
    <div
      ref={container}
      className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none flex justify-center">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between w-full max-w-sm pointer-events-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h5 className="font-bold text-sm">
              {message || "Action Confirmed"}
            </h5>
            <p className="text-xs text-slate-400">{subMessage}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-full">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
