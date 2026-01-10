import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Clock from "./components/Clock";
import AttendanceForm from "./components/AttendanceForm";
import ActionButtons from "./components/ActionButtons";
import RecentActivity from "./components/RecentActivity";
import ConfirmationModal from "./components/ConfirmationModal";
import { format } from "date-fns";
import { api } from "./services/api";
import Quotes from "./components/Quotes";

import { useAttendanceLogs } from "./hooks/useAttendanceLogs";
import FAB from "./components/FAB";
import ModalCalculator from "./components/ModalCalculator";

function App() {
  const [studentName, setStudentName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("form_studentName") || "";
    }
    return "";
  });
  const [section, setSection] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("form_section") || "";
    }
    return "";
  });
  const [studentNumber, setStudentNumber] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("form_studentNumber") || "";
    }
    return "";
  });

  // Use the custom hook for logs and polling
  const {
    logs,
    isLoading: isLogsLoading,
    fetchLogs,
    triggerPolling,
  } = useAttendanceLogs();

  // Local loading state for submission actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ message: "", subMessage: "" });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    // Initial fetch of logs
    fetchLogs();
  }, [fetchLogs]);

  // Persist form inputs
  useEffect(() => {
    localStorage.setItem("form_studentName", studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem("form_section", section);
  }, [section]);

  useEffect(() => {
    localStorage.setItem("form_studentNumber", studentNumber);
  }, [studentNumber]);

  const validateForm = () => {
    const newErrors = {};
    if (!studentName.trim()) newErrors.studentName = true;
    if (!section) newErrors.section = true;
    if (!studentNumber.trim()) newErrors.studentNumber = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleTimeIn = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const now = new Date();

    try {
      await api.timeIn(studentName, section, studentNumber, now);
      // Trigger polling after action
      triggerPolling();
    } catch (error) {
      console.error("Failed to sync with Google Sheets", error);
    }

    // Optimistic update if needed or just wait for polling?
    // The requirement says "After the form is successfully submitted... If the new data is identical... continue refreshing"
    // So we rely on polling for the list update.

    setModalData({
      message: "Action Confirmed",
      subMessage: `Timed IN successfully at ${format(now, "hh:mm a")}`,
    });
    setModalOpen(true);
    setIsSubmitting(false);
  };

  const handleTimeOut = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const now = new Date();

    try {
      await api.timeOut(studentName, section, studentNumber, now);
      // Trigger polling after action
      triggerPolling();
    } catch (error) {
      console.error("Failed to sync with Google Sheets", error);
    }

    setModalData({
      message: "Action Confirmed",
      subMessage: `Timed OUT successfully at ${format(now, "hh:mm a")}`,
    });
    setModalOpen(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 min-h-screen  overflow-hidden flex flex-col relative transition-colors duration-300">
        <div className="px-6 flex-1 overflow-y-auto pb-20">
          <Header theme={theme} toggleTheme={toggleTheme} />
          <Clock />
          <Quotes />

          <AttendanceForm
            studentName={studentName}
            setStudentName={setStudentName}
            section={section}
            setSection={setSection}
            studentNumber={studentNumber}
            setStudentNumber={setStudentNumber}
            errors={errors}
            clearError={clearError}
          />
          <ActionButtons
            onTimeIn={handleTimeIn}
            onTimeOut={handleTimeOut}
            isLoading={isSubmitting}
          />
          <RecentActivity
            studentNumber={studentNumber}
            section={section}
            logs={logs}
            isLoading={isLogsLoading}
          />
        </div>

        {/* Floating Action Button */}
        <FAB onClick={() => setIsCalculatorOpen(true)} />
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalData.message}
        subMessage={modalData.subMessage}
      />

      <ModalCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}

export default App;
