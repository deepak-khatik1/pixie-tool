import path from "path";
import xlsx from "xlsx";
import { fileURLToPath } from "url";
import fs from "fs";
import { bmsFileName } from "../lib/bmsConfig.js";

// Path to the Excel file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const excelFilePath = path.join(
  __dirname,
  "../../",
  "public",
  bmsFileName,
);

// Create file if it doesn't exist
if (!fs.existsSync(excelFilePath)) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet([]);
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  xlsx.writeFile(wb, excelFilePath);
}
// console.log(excelFilePath);

// Read Excel file
const readExcelFile = () => {
  try {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return [];
  }
};

// Write to Excel file
const writeExcelFile = (data) => {
  try {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    xlsx.writeFile(wb, excelFilePath);
  } catch (error) {
    console.error("Error writing Excel file:", error);
  }
};

const addRow = (event) => {
  try {
    const { eventName, eventDate, venue, city, category, url, status } = event;
    const data = readExcelFile();
    data.push({ eventName, eventDate, venue, city, category, url, status });
    writeExcelFile(data);
  } catch (error) {
    console.error("Error adding row to Excel file:", error);
  }
};

// const getAllRows = (event) => {
//   const data = readExcelFile();
//   return data;
// };

const normalizeEventDates = () => {
  const data = readExcelFile();
  data.forEach((row) => {
    const dateMatch = row.eventDate.match(/\w+\s+(\d+)\s+(\w+)\s+(\d+)/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      row.eventDate = new Date(`${month} ${day} ${year}`)
        .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        .split(",")[0];
    }
  });
  writeExcelFile(data);
};

const syncEventStatus = () => {
  const data = readExcelFile();

  data.forEach((row) => {
    const eventDate = new Date(row.eventDate);
    const currentDateIST = new Date(
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    );
    if (eventDate < currentDateIST) {
      row.status = "Expired";
    }
  });
  writeExcelFile(data);
};

const deduplicateEvents = () => {
  const data = readExcelFile();
  const uniqueEvents = [];
  const eventSet = new Set();

  data.forEach((row) => {
    if (!eventSet.has(row.url)) {
      eventSet.add(row.url);
      uniqueEvents.push(row);
    }
  });

  writeExcelFile(uniqueEvents);
};

export {
  addRow,
  // getAllRows,
  normalizeEventDates,
  syncEventStatus,
  deduplicateEvents,
};
