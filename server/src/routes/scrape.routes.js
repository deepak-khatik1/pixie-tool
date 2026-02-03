import express from "express";
import { scrapeBookMyShow } from "../services/puppeteer.service.js";
import {
  addRow,
  deduplicateEvents,
  normalizeEventDates,
} from "../services/excel.service.js";

const router = express.Router();

router.get("/:city", async (req, res) => {
  const city = req.params.city;
  let events = [];

  try {
    events = await scrapeBookMyShow(city);
    //   console.log(events);

    for (const event of events) {
      addRow(event);
    }
    normalizeEventDates();
    deduplicateEvents();
  } catch (error) {
    console.error("Error scraping events:", error);
    // return res.status(500).json({ msg: "Error scraping events", error });
  }

  res.status(200).json({
    msg: `Scraping events for ${city} completed`,
    totalEvents: events.length,
    events,
  });
});

export default router;
