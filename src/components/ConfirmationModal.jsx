import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ConfirmationModal({
  isOpen,
  onClose,
  message,
  subMessage,
}) {
  // Auto close after 3 seconds
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
