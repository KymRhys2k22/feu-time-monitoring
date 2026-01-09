function doGet(e) {
  return ContentService.createTextOutput("Success").setMimeType(
    ContentService.MimeType.TEXT
  );
}

function doPost(e) {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master");
    if (!sheet) {
      // Create Master sheet if it doesn't exist and set headers
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Master");
      sheet.appendRow([
        "NAME",
        "SECTION",
        "STUDENT NUMBER",
        "IN",
        "OUT",
        "DATE",
      ]);
    }

    // Expecting an array with one object based on user request:
    // [{"NAME":"...","SECTION":"...","STUDENT NUMBER":"...","IN":"...","OUT":"...","DATE":"..."}]

    const rawData = JSON.parse(e.postData.contents);
    const data = Array.isArray(rawData) ? rawData[0] : rawData;

    const name = data.NAME;
    const section = data.SECTION;
    const studentNumber = data["STUDENT NUMBER"];
    const timeIn = data.IN;
    const timeOut = data.OUT;
    const date = data.DATE;

    // Determine action based on fields or look for an explicit ACTION field if sent
    let action = data.ACTION;
    if (!action) {
      if (timeIn && (!timeOut || timeOut === "")) action = "TIME_IN";
      else if (timeOut && (!timeIn || timeIn === "")) action = "TIME_OUT";
    }

    const lastRow = sheet.getLastRow();

    // ACTION: TIME_IN
    if (action === "TIME_IN") {
      // Append new row directly
      // Columns: NAME (0), SECTION (1), STUDENT NUMBER (2), IN (3), OUT (4), DATE (5)
      sheet.appendRow([name, section, studentNumber, timeIn, "", date]);
      return ContentService.json({ status: "success", message: "Timed In" });
    }

    // ACTION: TIME_OUT
    else if (action === "TIME_OUT") {
      // Only read data if there are rows to read (excluding header if possible, but safe to check > 1)
      if (lastRow > 1) {
        // Read columns 1-6 (A to F)
        const range = sheet.getRange(2, 1, lastRow - 1, 6);
        const values = range.getValues();

        // Find the last entry for this person today that hasn't timed out
        for (let i = values.length - 1; i >= 0; i--) {
          const row = values[i];
          // row[0]=NAME, row[5]=DATE, row[4]=OUT
          // Check for matching Name, Date, and EMPTY Out time
          if (row[0] === name && row[5] === date && row[4] === "") {
            // Update OUT column (Column 5 corresponds to E)
            sheet.getRange(i + 2, 5).setValue(timeOut);
            return ContentService.json({
              status: "success",
              message: "Timed Out",
            });
          }
        }
      }

      // Fallback if no entry found or sheet is empty: Create new row
      sheet.appendRow([name, section, studentNumber, "N/A", timeOut, date]);
      return ContentService.json({
        status: "success",
        message: "Timed Out (No previous Time In found)",
      });
    }

    return ContentService.json({
      status: "error",
      message: "Invalid data or action",
    });
  } catch (error) {
    return ContentService.json({ status: "error", message: error.toString() });
  }
}

ContentService.json = function (data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
};
