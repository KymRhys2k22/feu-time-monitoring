import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Clock from "./components/Clock";
import AttendanceForm from "./components/AttendanceForm";
import ActionButtons from "./components/ActionButtons";
import RecentActivity from "./components/RecentActivity";
import ConfirmationModal from "./components/ConfirmationModal";
import { format } from "date-fns";
import { api } from "./services/api";

function App() {
  const [studentName, setStudentName] = useState("");
  const [section, setSection] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem("attendanceLogs");
    if (savedLogs) {
      try {
        return JSON.parse(savedLogs);
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ message: "", subMessage: "" });
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

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

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("attendanceLogs", JSON.stringify(logs));
  }, [logs]);

  const handleTimeIn = async () => {
    if (!studentName || !section || !studentNumber) {
      alert("Please enter your name, student number, and select a section.");
      return;
    }

    setIsLoading(true);

    const now = new Date();

    try {
      await api.timeIn(studentName, section, studentNumber, now);
    } catch (error) {
      console.error("Failed to sync with Google Sheets", error);
      // Optional: Show error toast, but we proceed with local log
    }

    // Proceed with local update regardless of API success (optimistic UI)
    // setTimeout(() => {
    const newLog = {
      id: now.getTime(),
      type: "TIME_IN",
      studentName,
      section,
      studentNumber,
      timestamp: now.toISOString(),
      status: "On Time",
    };

    setLogs((prev) => [newLog, ...prev]);
    setModalData({
      message: "Action Confirmed",
      subMessage: `Timed IN successfully at ${format(now, "hh:mm a")}`,
    });
    setModalOpen(true);
    setIsLoading(false);
    // }, 800);
  };

  const handleTimeOut = async () => {
    if (!studentName || !section || !studentNumber) {
      alert("Please enter your name, student number, and select a section.");
      return;
    }

    setIsLoading(true);

    const now = new Date();

    try {
      await api.timeOut(studentName, section, studentNumber, now);
    } catch (error) {
      console.error("Failed to sync with Google Sheets", error);
    }

    // setTimeout(() => {
    const newLog = {
      id: now.getTime(),
      type: "TIME_OUT",
      studentName,
      section,
      studentNumber,
      timestamp: now.toISOString(),
      status: "On Time",
    };

    setLogs((prev) => [newLog, ...prev]);
    setModalData({
      message: "Action Confirmed",
      subMessage: `Timed OUT successfully at ${format(now, "hh:mm a")}`,
    });
    setModalOpen(true);
    setIsLoading(false);
    // }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 min-h-screen shadow-xl overflow-hidden flex flex-col relative transition-colors duration-300">
        <div className="px-6 flex-1 overflow-y-auto pb-20">
          <Header theme={theme} toggleTheme={toggleTheme} />
          <Clock />
          <AttendanceForm
            studentName={studentName}
            setStudentName={setStudentName}
            section={section}
            setSection={setSection}
            studentNumber={studentNumber}
            setStudentNumber={setStudentNumber}
          />
          <ActionButtons
            onTimeIn={handleTimeIn}
            onTimeOut={handleTimeOut}
            isLoading={isLoading}
          />
          {/* <RecentActivity logs={logs} /> */}
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalData.message}
        subMessage={modalData.subMessage}
      />
    </div>
  );
}

export default App;
