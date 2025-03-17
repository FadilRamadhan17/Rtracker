import React, { useState } from "react";
import { Info } from "lucide-react";

interface IbadahStatsProps {
  data?: any;
}

const IbadahStats: React.FC<IbadahStatsProps> = ({ data }) => {
  const [showShalatTooltip, setShowShalatTooltip] = useState(false);
  const [showTarawihTooltip, setShowTarawihTooltip] = useState(false);

  if (!data || !data.data || data.data.length === 0) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  const allData = Array.isArray(data?.data) ? data.data : [];
  const today = new Date().toISOString().split("T")[0];

  const totalPuasaScore = allData.reduce((sum: number, item: any) => {
    return sum + (item.puasa === "Sempurna" ? 10 : 0);
  }, 0);

  const maxPuasaScore = allData.length * 10;
  const puasaRate =
    maxPuasaScore > 0
      ? ((totalPuasaScore / maxPuasaScore) * 100).toFixed(1)
      : "0.0";

  let totalShalatScore = 0;
  let totalShalatEntries = 0;
  let totalShalatCount = 0;

  allData.forEach((entry: any) => {
    if (entry.lokasiShalat && typeof entry.lokasiShalat === "object") {
      let shalatPerformed = 0;
      Object.values(entry.lokasiShalat).forEach((lokasi) => {
        if (lokasi === "Masjid") totalShalatScore += 10;
        else if (lokasi === "Rumah") totalShalatScore += 5;
        shalatPerformed++;
      });

      totalShalatCount += shalatPerformed;
      totalShalatEntries += 5;
    }
  });

  const maxShalatScore = totalShalatEntries * 10;
  const shalatRate =
    maxShalatScore > 0
      ? ((totalShalatScore / maxShalatScore) * 100).toFixed(1)
      : "0.0";
  const shalatPresenceRate =
    allData.length > 0 ? (totalShalatCount / (allData.length * 5)) * 100 : "0";

  let totalTarawihScore = 0;
  let totalTarawihEntries = 0;
  let totalTarawihCount = 0;

  allData.forEach((entry: any) => {
    totalTarawihEntries++;
    if (!entry.tarawih || entry.tarawih === "Tidak") {
      return;
    }

    totalTarawihCount++;
    let rakaatScore =
      entry.tarawih === "8 Rakaat" ? 5 : entry.tarawih === "20 Rakaat" ? 10 : 0;
    let lokasiScore =
      entry.lokasiTarawih === "Rumah"
        ? 5
        : entry.lokasiTarawih === "Masjid"
        ? 10
        : 0;

    totalTarawihScore += rakaatScore + lokasiScore;
  });

  const maxTarawihScore = totalTarawihEntries * 20;
  const tarawihRate =
    maxTarawihScore > 0
      ? ((totalTarawihScore / maxTarawihScore) * 100).toFixed(1)
      : "0.0";
  const tarawihPresenceRate =
    totalTarawihEntries > 0
      ? (totalTarawihCount / totalTarawihEntries) * 100
      : "0";

  // Cari data yang sesuai dengan tanggal hari ini
  const todayData = allData.find((entry: any) => entry.tanggal === today);
  const khatamQuranToday = todayData ? todayData.khatamQuran || 0 : 0;

  // Ambil Current Juz dan Halaman Terakhir dari Data Terbaru
  const latestData = allData[allData.length - 1] || {};
  const currentJuz = latestData.juz || "N/A";
  const currentHalaman = latestData.halamanTerakhir || "N/A";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4 ml-[-15px]">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-600 text-[14px]">Rating Puasa</h3>
        <p className="text-xl font-semibold">{puasaRate}%</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 relative">
        <h3 className="text-gray-600 text-[14px] flex items-center">
          Rating Kesempurnaan Shalat
          <span
            className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer relative"
            onMouseEnter={() => setShowShalatTooltip(true)}
            onMouseLeave={() => setShowShalatTooltip(false)}
          >
            <Info size={18} />
            {showShalatTooltip && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-50">
                Rating Kehadiran Shalat {shalatPresenceRate}%
              </div>
            )}
          </span>
        </h3>
        <p className="text-xl font-semibold">{shalatRate}%</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 relative">
        <h3 className="text-gray-600 text-[14px] flex items-center">
          Rating Kesempurnaan Tarawih
          <span
            className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer relative"
            onMouseEnter={() => setShowTarawihTooltip(true)}
            onMouseLeave={() => setShowTarawihTooltip(false)}
          >
            <Info size={18} />
            {showTarawihTooltip && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                Rating Kehadiran Tarawih {tarawihPresenceRate}%
              </div>
            )}
          </span>
        </h3>
        <p className="text-xl font-semibold">{tarawihRate}%</p>
      </div>
      {/* Current Juz + Halaman */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-600 text-[14px]">Juz & Halaman</h3>
        <p className="text-xl font-semibold">
          Juz {currentJuz}, Halaman {currentHalaman}
        </p>
      </div>

      {/* Total Khatam Quran Hari Ini */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-600 text-[14px]">Khatam Quran</h3>
        <p className="text-xl font-semibold">{khatamQuranToday}</p>
      </div>
    </div>
  );
};

export default IbadahStats;
