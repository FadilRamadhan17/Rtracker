import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IbadahPointsChart = ({
  data = { data: [] },
}: {
  data: { data: any[] };
}) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data.data) || data.data.length === 0) {
      return [];
    }

    const sortedData = [...data.data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let previousPoints = 0;

    return sortedData.map((entry) => {
      let dailyPoints = 0;

      if (entry.lokasiShalat && typeof entry.lokasiShalat === "object") {
        Object.values(entry.lokasiShalat).forEach((lokasi) => {
          if (lokasi === "Masjid") dailyPoints += 20;
          else if (lokasi === "Rumah") dailyPoints += 10;
        });
      }

      if (entry.puasa === "Sempurna") {
        dailyPoints += 10;
      }

      if (entry.tarawih && entry.tarawih !== "Tidak") {
        if (entry.tarawih === "8 Rakaat") dailyPoints += 5;
        else if (entry.tarawih === "20 Rakaat") dailyPoints += 10;

        if (entry.lokasiTarawih === "Masjid") dailyPoints += 10;
        else if (entry.lokasiTarawih === "Rumah") dailyPoints += 5;
      }

      if (entry.tilawah && typeof entry.tilawah === "number") {
        dailyPoints += entry.tilawah * 2;
      }

      const date = new Date(entry.date);
      const formattedDate = `${date.getDate()} ${date.toLocaleString(
        "default",
        { month: "short" }
      )}`;

      const percentageChange =
        previousPoints > 0
          ? ((dailyPoints - previousPoints) / previousPoints) * 100
          : 0;

      previousPoints = dailyPoints;

      return {
        date: formattedDate,
        points: dailyPoints,
        percentageChange: parseFloat(percentageChange.toFixed(1)),
      };
    });
  }, [data]);

  const latestData = chartData[chartData.length - 1];

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-lg p-6 shadow">
        <p className="text-gray-500">Tidak Ada Data Yang Tersedia.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-500 text-[14px]">Chart Kebaikan</p>
          <h2 className="text-[22px] font-semibold">
            {chartData.reduce((sum, entry) => sum + entry.points, 0)} Kebaikan
          </h2>
        </div>
        {latestData && (
          <div
            className={`text-[14px] px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
              latestData.percentageChange >= 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {latestData.percentageChange >= 0 ? "\u2191" : "\u2193"}{" "}
            {latestData.percentageChange}%
          </div>
        )}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={30}
            />
            <Tooltip
              formatter={(value) => [`${value} Kebaikan`]}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IbadahPointsChart;
