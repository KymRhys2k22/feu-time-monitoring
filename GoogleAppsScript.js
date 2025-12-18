function doGet(e) {
  return ContentService.createTextOutput("Success").setMimeType(
    ContentService.MimeType.TEXT
  );
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Expecting an array with one object based on user request:
    // [{"NAME":"...","SECTION":"...","IN":"...","OUT":"...","DATE":"..."}]

    const rawData = JSON.parse(e.postData.contents);
    const data = Array.isArray(rawData) ? rawData[0] : rawData;

    const name = data.NAME;
    const section = data.SECTION;
    const timeIn = data.IN;
    const timeOut = data.OUT;
    const date = data.DATE;

    // Determine action based on fields or look for an explicit ACTION field if sent
    // We'll use the presence of IN vs OUT to guess if not specified
    // Ideally we pass ACTION as a hidden field, but let's try to deduce for flexibility
    // Or we just strictly follow: If IN is provided, it's a Time In. If OUT is provided, it's Time Out.

    let action = data.ACTION;
    if (!action) {
      if (timeIn && (!timeOut || timeOut === "")) action = "TIME_IN";
      else if (timeOut && (!timeIn || timeIn === "")) action = "TIME_OUT";
    }

    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(2, 1, lastRow - 1, 5); // Columns 1-5
    const values = range.getValues();

    if (action === "TIME_IN") {
      // Append new row
      // Columns: NAME, SECTION, IN, OUT, DATE
      sheet.appendRow([name, section, timeIn, "", date]);
      return ContentService.json({ status: "success", message: "Timed In" });
    } else if (action === "TIME_OUT") {
      // Find the last entry for this person today that hasn't timed out
      for (let i = values.length - 1; i >= 0; i--) {
        const row = values[i];
        // row[0]=NAME, row[4]=DATE, row[3]=OUT
        if (row[0] === name && row[4] === date && row[3] === "") {
          sheet.getRange(i + 2, 4).setValue(timeOut); // Update OUT column
          return ContentService.json({
            status: "success",
            message: "Timed Out",
          });
        }
      }
      // Fallback if no entry found
      sheet.appendRow([name, section, "N/A", timeOut, date]);
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
