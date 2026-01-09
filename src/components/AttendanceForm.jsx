import React from "react";
import { User, Users, MapPin, CheckCircle2 } from "lucide-react";

export default function AttendanceForm({
  studentName,
  setStudentName,
  section,
  setSection,
  studentNumber,
  setStudentNumber,
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
          <span className="text-slate-400 font-bold text-xs pl-0.5">#</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          placeholder="Student Number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
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
          <option value="ABM1201 ACC">ABM1201 ACC</option>
          <option value="ABM1201 BUS">ABM1201 BUS</option>
          <option value="GAS1201">GAS1201</option>
          <option value="HUM1201 A">HUM1201 A</option>
          <option value="HUM1201 B">HUM1201 B</option>
          <option value="SCP1201">SCP1201</option>
          <option value="SCS1201">SCS1201</option>
          <option value="SCV1201">SCV1201</option>
          <option value="SEC1201">SEC1201</option>
          <option value="SEL1201">SEL1201</option>
          <option value="SHA1201 A">SHA1201 A</option>
          <option value="SHA1201 B">SHA1201 B</option>
          <option value="SHA1201 C">SHA1201 C</option>
          <option value="SIT1201 A">SIT1201 A</option>
          <option value="SIT1201 B">SIT1201 B</option>
          <option value="SME1201">SME1201</option>
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
