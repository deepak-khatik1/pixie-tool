import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "./api/axios.js";

const cities = ["Jaipur", "Mumbai", "Delhi", "Chandigarh", "Bengaluru"];

export default function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCityApiCall = async () => {
    if (!selectedCity) {
      toast.error("Please select a city");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/scrape/${selectedCity.toLowerCase()}`);
      if (res.status !== 200) {
        throw new Error("API call failed");
      }
      toast.success(`Scraped events for ${selectedCity}`);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to scrape events");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/excel/download", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "events.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Toaster position="top-right" reverseOrder={false} />
      {loading ? (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-white text-center mt-4">Loading...</p>
          </div>
          <p className="text-yellow-300 text-center mt-5">
            This might take a few moments...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
          <h1 className="text-2xl font-semibold text-white mb-6 text-center">
            BookMyShow Events Scraper
          </h1>

          {/* City Dropdown */}
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-2">
              Select City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg bg-slate-900 text-white border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose a city --</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCityApiCall}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition duration-200 cursor-pointer"
            >
              Scrape Events for Selected City
            </button>
            <button
              onClick={handleDownloadFile}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition duration-200 cursor-pointer"
            >
              Download Latest Scrape File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
