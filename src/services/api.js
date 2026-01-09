export const api = {
  // Replace this with your actual Web App URL after deployment
  url: "https://script.google.com/macros/s/AKfycbxZt3dYuGGVm494M13mmkEYfHOPoGeMmISlvi6uLhlWLJyjX4v66cCWVKNwWEuDzY4Atg/exec",
  sheetUrl:
    "https://opensheet.elk.sh/190FmQf7sRJovfSUjxX0oE_0Ye6OVtFkn_yWhMk4KoAA/Master",

  timeIn: async (name, section, studentNumber, dateObj = new Date()) => {
    // Validation removed to allow actual URL

    const time = dateObj.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = format(dateObj); // MM-DD-YYYY

    const payload = [
      {
        NAME: name,
        SECTION: section,
        "STUDENT NUMBER": studentNumber,
        IN: time,
        OUT: "",
        DATE: date,
        ACTION: "TIME_IN", // Helper for script
      },
    ];

    try {
      await fetch(api.url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  timeOut: async (name, section, studentNumber, dateObj = new Date()) => {
    // Validation removed to allow actual URL

    const time = dateObj.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = format(dateObj);

    const payload = [
      {
        NAME: name,
        SECTION: section,
        "STUDENT NUMBER": studentNumber,
        IN: "",
        OUT: time,
        DATE: date,
        ACTION: "TIME_OUT",
      },
    ];

    try {
      await fetch(api.url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  getLogs: async () => {
    try {
      const response = await fetch(api.sheetUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      return await response.json();
    } catch (error) {
      console.error("API Error (getLogs):", error);
      return [];
    }
  },
};

// Helper to match user's requested date format "MM-DD-YYYY"
function format(date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const y = date.getFullYear();
  return `${m}-${d}-${y}`;
}
