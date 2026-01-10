import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import AppCalculator from "./calculator/Calculator";

export default function ModalCalculator({ isOpen, onClose }) {
  const overlay = useRef(null);
  const container = useRef(null);
  const [isRendered, setIsRendered] = useState(isOpen);

  // Sync state with prop during render to avoid effect flash
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

  useEffect(() => {
    if (!isRendered) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Animate In: isOpen is true
        if (overlay.current)
          gsap.to(overlay.current, { opacity: 1, duration: 0.3 });
        if (container.current) {
          gsap.fromTo(
            container.current,
            { y: 50, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "elastic.inOut(1, 0.5)",
            }
          );
        }
      } else {
        // Animate Out: isOpen is false, but isRendered is still true (exit phase)
        if (overlay.current)
          gsap.to(overlay.current, { opacity: 0, duration: 0.2 });
        if (container.current) {
          gsap.to(container.current, {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: "elastic.inOut(1, 0.5)",
          });
        }
      }
    }, [overlay, container]);

    return () => ctx.revert();
  }, [isOpen, isRendered]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlay}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div ref={container} className="relative z-10 opacity-0">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <AppCalculator />
        </div>
      </div>
    </div>
  );
}
