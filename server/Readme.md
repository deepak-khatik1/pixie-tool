# API Documentation

## Overview
This is a backend API server built with Node.js that provides endpoints for web scraping and Excel file operations.

## Getting Started

### Installation
```bash
pnpm install
```

### Running the Server
```bash
npm start
```

The server will start on the configured port.

## API Routes

### Excel Routes
**Base Path:** `/api/excel`

#### 1. Export Data to Excel
- **Method:** `POST`
- **Endpoint:** `/export`
- **Description:** Exports provided data to an Excel file
- **Request Payload:**
```json
{
  "data": [],
  "fileName": "export.xlsx"
}
```
- **Response (Success - 200):**
```json
{
  "success": true,
  "message": "File exported successfully",
  "filePath": "/path/to/file.xlsx"
}
```
- **Error Responses:**
  - `400 Bad Request`: Invalid data format
  - `500 Internal Server Error`: File generation failed

---

### Scrape Routes
**Base Path:** `/api/scrape`

#### 1. Scrape Website
- **Method:** `POST`
- **Endpoint:** `/website`
- **Description:** Scrapes content from a specified website
- **Request Payload:**
```json
{
  "url": "https://example.com",
  "selector": ".content"
}
```
- **Response (Success - 200):**
```json
{
  "success": true,
  "data": [],
  "message": "Scraping completed successfully"
}
```
- **Error Responses:**
  - `400 Bad Request`: Invalid URL format
  - `404 Not Found`: URL not accessible
  - `500 Internal Server Error`: Scraping failed

---

## Cron Jobs

### Scheduled Tasks
*Add your cron job details here. Examples:*

- **Job Name:** Auto Export Data
  - **Schedule:** Daily at 2:00 AM (0 2 * * *)
  - **Description:** Automatically exports data to Excel
  - **Error Handling:** Logs errors to console

---

## Error Handling

All API endpoints follow a standard error response format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Environment Variables

*Add your environment variables here*

---

## Dependencies

See [package.json](package.json) for all dependencies.

---

## File Structure

- `src/controllers/` - Request handlers
- `src/routes/` - API route definitions
- `src/services/` - Business logic
- `src/lib/` - Utility functions

---

## License

*Add license information here*