import express from "express";
import {
  syncEventStatus,
  normalizeEventDates,
  deduplicateEvents,
} from "../services/excel.service.js";
import { excelFilePath } from "../services/excel.service.js";
import { bmsFileName } from "../lib/bmsConfig.js";

const router = express.Router();

router.get("/sync", async (req, res) => {
  syncEventStatus();
  res.status(200).json({ msg: "Event Status Synced Successfully" });
});

router.get("/normalize", async (req, res) => {
  normalizeEventDates();
  res.status(200).json({ msg: "Event Dates Normalized Successfully" });
});

router.get("/deduplicate", async (req, res) => {
  deduplicateEvents();
  res.status(200).json({ msg: "Events Deduplicated Successfully" });
});

router.get("/download", async (req, res) => {
  normalizeEventDates();
  syncEventStatus();
  deduplicateEvents();

  const filePath = excelFilePath;
  res.download(filePath, bmsFileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

export default router;
