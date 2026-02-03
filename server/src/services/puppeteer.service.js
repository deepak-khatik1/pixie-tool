// import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { delay } from "../lib/helpers.js";
import {
  eventContainerSelector,
  eventsCardSelector,
  nameSelector,
  venueSelector,
  categorySelector,
  dateSelector,
} from "../lib/bmsConfig.js";

puppeteerExtra.use(StealthPlugin());

const scrapeBookMyShow = async (city) => {
  const browser = await puppeteerExtra.launch({ headless: true });
  const page = await browser.newPage();

  const url = `https://in.bookmyshow.com/explore/events-${city.toLowerCase()}`;
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for the events to load
  await page.waitForSelector(eventContainerSelector);

  await delay(2000, 5000); // Random delay to mimic human behavior

  // Wait until all events are loaded by scrolling to the bottom
  const waitForScrollToBottom = async () => {
    await page.evaluate(async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      let currentScroll = 0;
      while (currentScroll < scrollHeight) {
        window.scrollBy(0, window.innerHeight); // Scroll down
        currentScroll = window.scrollY + window.innerHeight;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    });
  };

  await waitForScrollToBottom(); // Wait will fetch 64 events otherwise only 20

  const events = await page.evaluate(
    (eventsCardSelector, nameSelector, venueSelector, categorySelector) => {
      const eventList = [];
      const eventCards = document.querySelectorAll(eventsCardSelector);

      eventCards.forEach((card) => {
        const eventName = card.querySelector(nameSelector)?.textContent.trim();
        const venue = card.querySelector(venueSelector)?.textContent.trim();
        const category = card
          .querySelector(categorySelector)
          ?.textContent.trim();
        const eventUrl = card.href;
        const status = "Upcoming"; // all events are "Upcoming" by default

        eventList.push({
          eventName,
          venue,
          category,
          eventUrl,
          status,
        });
      });

      return eventList;
    },
    eventsCardSelector,
    nameSelector,
    venueSelector,
    categorySelector,
  );

  await delay(1000, 3000);

  for (const event of events) {
    const eventPage = await browser.newPage();
    await eventPage.goto(event.eventUrl, { waitUntil: "domcontentloaded" });

    try {
      await eventPage.waitForSelector(dateSelector);
      await delay(2000, 5000);

      const eventDate = await eventPage.evaluate((dateSelector) => {
        return document.querySelector(dateSelector)?.textContent.trim();
      }, dateSelector);

      // console.log("Event Date for", event.eventName, ":", eventDate);

      event.eventDate = eventDate; // populate date
    } catch (error) {
      console.error(`Error fetching event date for ${event.eventName}:`, error);
      event.eventDate = "NA";
    }

    await eventPage.close();
  }

  await browser.close();

  events.forEach((event) => {
    event.city = city;
    event.url = event.eventUrl;
    delete event.eventUrl;
  });

  return events;
};

export { scrapeBookMyShow };
