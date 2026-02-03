import express from "express";
import cors from "cors";
import cron from "node-cron";
import scrapeRouter from "./routes/scrape.routes.js";
import excelRouter from "./routes/excel.routes.js";
import { syncEventStatus } from "./services/excel.service.js";
import { scrapeBookMyShow } from "./services/puppeteer.service.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", async (req, res) => {
  res.status(200).json({ msg: "Event Scraper API" });
});

app.use("/scrape", scrapeRouter);
app.use("/excel", excelRouter);

// Schedule scraping job (runs at midnight every day)
cron.schedule("0 0 * * *", async () => {
  console.log("Running the scraping task...");
  await scrapeBookMyShow("jaipur"); // Scraping for Jaipur daily
});

// Schedule status sync job (runs at 1 AM every day)
cron.schedule("0 1 * * *", () => {
  console.log("Syncing event statuses...");
  syncEventStatus();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    msg: err.message || "Internal Server Error",
    status: err.status || 500,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
