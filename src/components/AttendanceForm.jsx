import React from "react";
import { User, Users, MapPin, CheckCircle2 } from "lucide-react";

export default function AttendanceForm({
  studentName,
  setStudentName,
  section,
  setSection,
}) {
  return (
    <div className="w-full space-y-4 mb-8">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
        Student Details
      </h4>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          placeholder="Enter your full name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Users className="h-5 w-5 text-slate-400" />
        </div>
        <select
          className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none transition-colors"
          value={section}
          onChange={(e) => setSection(e.target.value)}>
          <option value="" disabled>
            Select your section
          </option>
          <option value="STEM 12-1">STEM 12-1</option>
          <option value="STEM 12-2">STEM 12-2</option>
          <option value="ABM 12-1">ABM 12-1</option>
          <option value="HUMSS 12-1">HUMSS 12-1</option>
        </select>

        {/* Adds a custom gradient box similar to the design if desired, or just use the select */}
        {/* For now, keeping it simple to match the functional requirement first, but we can style the arrow or add the gradient block later */}
      </div>

      <div className="flex items-center space-x-2 text-slate-500 text-sm mt-2">
        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" />
        <span>Location verified within workplace perimeter.</span>
      </div>
    </div>
  );
}
