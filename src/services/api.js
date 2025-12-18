export const api = {
  // Replace this with your actual Web App URL after deployment
  url: "https://script.google.com/macros/s/AKfycbwljxQETO1PBws1wTQO8iN83Ixke1R6kY_-NgtEK5HHuvU-SCC4psKVHgEDGVWgvo1AMw/exec",

  timeIn: async (name, section, dateObj = new Date()) => {
    if (
      api.url ===
      "https://script.google.com/macros/s/AKfycbwljxQETO1PBws1wTQO8iN83Ixke1R6kY_-NgtEK5HHuvU-SCC4psKVHgEDGVWgvo1AMw/exec"
    ) {
      console.warn("Google Script URL not configured");
      return;
    }

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

  timeOut: async (name, section, dateObj = new Date()) => {
    if (
      api.url ===
      "https://script.google.com/macros/s/AKfycbwljxQETO1PBws1wTQO8iN83Ixke1R6kY_-NgtEK5HHuvU-SCC4psKVHgEDGVWgvo1AMw/exec"
    ) {
      console.warn("Google Script URL not configured");
      return;
    }

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
};

// Helper to match user's requested date format "MM-DD-YYYY"
function format(date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const y = date.getFullYear();
  return `${m}-${d}-${y}`;
}
