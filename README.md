
---
## **Event Scraping Tool**
---

### *Note:
Please wait for few minutes after clicking the **"Scrape Events for Selected City"** button.

---

### **Overview**

This project is a web scraping tool that extracts event data from **BookMyShow**. It collects details like **event name**, **venue**, **category**, **event date**, and **event URL**. The data is stored in **Excel File** and updated daily using **automated scraping**.

---

### **Key Features**

- **Event Extraction**: Scrapes event details from BookMyShow.
- **City Selection**: Supports cities like **Jaipur**, **Mumbai**, **Delhi**, **Chandigarh**, **Bengaluru**.
- **Data Storage**: Stores events in **Excel File**.
- **Automation**: Runs daily to keep event data up-to-date.
- **IP Mitigation**: Random delays to mimic human behavior and avoid bans.
- **Scalable**: Configurable for easy extension to other platforms.

---

### **Cron Jobs**

- **Scrape Jaipur Events**: Runs at midnight every day.
- **Sync Event Statuses**: Runs at 1 AM every day (mark expired events).

---

### **Tech Stack**

- **Backend**: Node.js, Express
- **Web Scraping**: Puppeteer
- **Automation**: Node-cron
- **Frontend**: React, Axios for interaction

---

### **GitHub Repository**

- https://github.com/deepak-khatik1/pixie-tool

---

### **Setup Instructions**

1. Clone the repository:

   `git clone https://github.com/deepak-khatik1/pixie-tool`

2. Change directory to pixie-tool:

   `cd pixie-tool`

3. Install dependencies and start Frontend:

   `cd client && pnpm install`
   `pnpm start`

4. Install dependencies and start Backend:

   `cd server && pnpm install`
   `pnpm start`

---


### **Frontend Working**

- **City Dropdown**: List supported cities.
  _( The Backend supports all the cities as per BookMyShow but limited cities on Frontend to avoid exceptions. )_

- **Scrape Events for Selected City**: Scrapes the events for selected city and update them to a Excel File in the server.
  _( This **may take few minutes** due to lazy loading & visiting individual event pages to extract date. )_
- **Download Latest Scrape File**: Sync and fetch the file from server and downloads on user's device.

---

### **Challenges and Improvements**

- **Lazy Loading**: Limited to 64 events due to BookMyShow’s lazy loading.
  _Future improvement_: Implement infinite scrolling or pagination.

- **Event Date Extraction**: Event dates were initially embedded in images, requiring navigation to individual event pages.
  _Future improvement_: Enhance event expiry logic based on event dates.

---

### **Future Enhancements**

- **Delete Stale Events** if events are expired since 30 days.
- **Multi-platform support** for scraping other event platforms.
- **Improved error handling** for robustness.
- **Proxy rotation** to scale scraping and avoid IP bans.

---
