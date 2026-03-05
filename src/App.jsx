import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Clock from "./components/Clock";
import AttendanceForm from "./components/AttendanceForm";
import ActionButtons from "./components/ActionButtons";
import RecentActivity from "./components/RecentActivity";
import ConfirmationModal from "./components/ConfirmationModal";
import { format } from "date-fns";
import { supabase } from "./services/supabaseClient";
import Quotes from "./components/Quotes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useAttendanceLogs } from "./hooks/useAttendanceLogs";
import FAB from "./components/FAB";
import ModalCalculator from "./components/ModalCalculator";

gsap.registerPlugin(useGSAP);

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

  // Refs for GSAP animation targets
  const appRef = useRef(null);
  const headerRef = useRef(null);
  const clockRef = useRef(null);
  const quotesRef = useRef(null);
  const formRef = useRef(null);
  const buttonsRef = useRef(null);
  const activityRef = useRef(null);
  const fabRef = useRef(null);

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

  // Page entrance animation — staggered cascade on mount
  useGSAP(
    () => {
      const sections = [
        headerRef.current,
        clockRef.current,
        quotesRef.current,
        formRef.current,
        buttonsRef.current,
        activityRef.current,
      ].filter(Boolean);

      gsap.set(sections, { opacity: 0, y: 24 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Stagger each section in sequentially
      tl.to(sections, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.12,
      });
    },
    { scope: appRef },
  );

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
      const timeString = format(now, "HH:mm");
      const dateString = format(now, "MM-dd-yyyy");

      const { error } = await supabase.from("student").insert([
        {
          name: studentName,
          section: section,
          date: dateString,
          in: timeString,
          out: "",
          student_number: studentNumber,
        },
      ]);

      if (error) throw error;

      triggerPolling();
    } catch (error) {
      console.error("Failed to sync with Supabase", error);
    }

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
      const timeString = format(now, "HH:mm");
      const dateString = format(now, "MM-dd-yyyy");

      const { error } = await supabase.from("student").insert([
        {
          name: studentName,
          section: section,
          date: dateString,
          in: "",
          out: timeString,
          student_number: studentNumber,
        },
      ]);

      if (error) throw error;

      triggerPolling();
    } catch (error) {
      console.error("Failed to sync with Supabase", error);
    }

    setModalData({
      message: "Action Confirmed",
      subMessage: `Timed OUT successfully at ${format(now, "hh:mm a")}`,
    });
    setModalOpen(true);
    setIsSubmitting(false);
  };

  return (
    <div
      ref={appRef}
      className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center transition-colors duration-300 lg:p-8">
      <div className="w-full max-w-md lg:max-w-6xl bg-white dark:bg-slate-900 min-h-[calc(100vh-2rem)] lg:min-h-0 lg:h-fit lg:rounded-3xl overflow-hidden flex flex-col relative transition-colors duration-300 shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="px-4 lg:px-6 flex-1 overflow-y-auto lg:overflow-visible pb-20 lg:pb-12">
          <div ref={headerRef}>
            <Header theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
            {/* Left Column: Form & Actions (Sticky on Desktop) */}
            <div className="lg:sticky lg:top-8 space-y-6 lg:space-y-8">
              <div ref={clockRef}>
                <Clock />
              </div>

              <div ref={quotesRef}>
                <Quotes />
              </div>

              <div ref={formRef}>
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
              </div>

              <div ref={buttonsRef}>
                <ActionButtons
                  onTimeIn={handleTimeIn}
                  onTimeOut={handleTimeOut}
                  isLoading={isSubmitting}
                />
              </div>
            </div>

            {/* Right Column: Activity Monitoring */}
            <div className="mt-8 lg:mt-0 lg:pt-4">
              <div ref={activityRef}>
                <RecentActivity
                  studentNumber={studentNumber}
                  section={section}
                  logs={logs}
                  isLoading={isLogsLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button — outside overflow-hidden container so fixed positioning works viewport-relative */}
      <div ref={fabRef}>
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
