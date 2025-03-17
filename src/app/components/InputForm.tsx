"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

type Shalat = "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";
type LokasiShalat = "Rumah" | "Masjid";
type TarawihOption = "Tidak" | "8 Rakaat" | "20 Rakaat";

type FormDataType = {
  date: string;
  puasa: string;
  tilawah: number;
  juz: string;
  halamanTerakhir: number;
  shalatWajib: Shalat[];
  lokasiShalat: Partial<Record<Shalat, LokasiShalat>>;
  tarawih: TarawihOption;
  lokasiTarawih: LokasiShalat;
  khatamQuran: number;
};

export default function DailyIbadahForm() {
  const [formData, setFormData] = useState<FormDataType>({
    date: "",
    puasa: "",
    tilawah: 0,
    juz: "",
    halamanTerakhir: 0,
    shalatWajib: [],
    lokasiShalat: {},
    tarawih: "Tidak",
    lokasiTarawih: "Masjid",
    khatamQuran: 0,
  });

  const [halamanAwal, setHalamanAwal] = useState(0);

  useEffect(() => {
    if (formData.date) {
      fetch(`/api/halamanTerakhir?beforeDate=${formData.date}`)
        .then((res) => res.json())
        .then((data) => {
          setHalamanAwal(data.halamanTerakhir || 0);
          setFormData((prev) => ({
            ...prev,
            halamanTerakhir: data.halamanTerakhir || 0,
          }));
        })
        .catch(() => console.error("Gagal mengambil data halaman terakhir"));
    }
  }, [formData.date]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      halamanTerakhir: halamanAwal + (prev.tilawah || 0),
    }));
  }, [formData.tilawah, halamanAwal]);

  const handleChange = (field: keyof FormDataType, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleShalatChange = (shalat: Shalat, checked: boolean) => {
    let newShalatWajib = [...formData.shalatWajib];
    let newLokasiShalat = { ...formData.lokasiShalat };

    if (checked) {
      newShalatWajib.push(shalat);
      newLokasiShalat[shalat] = "Masjid";
    } else {
      newShalatWajib = newShalatWajib.filter((s) => s !== shalat);
      delete newLokasiShalat[shalat];
    }

    setFormData({
      ...formData,
      shalatWajib: newShalatWajib,
      lokasiShalat: newLokasiShalat,
    });
  };

  const handleLokasiChange = (shalat: Shalat, lokasi: LokasiShalat) => {
    setFormData({
      ...formData,
      lokasiShalat: {
        ...formData.lokasiShalat,
        [shalat]: lokasi,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/ibadah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      alert("Data tersimpan!");
    } catch (err) {
      console.error("Error:", err);
      alert("Koneksi gagal");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full"
    >
      <h1 className="text-xl text-center mb-6 font-bold">Daily Ibadah Form</h1>

      {/* Container Utama */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Bagian 1: Shalat & Puasa */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg">
          {/* Tanggal */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border p-2 rounded"
              max={format(new Date(), "yyyy-MM-dd")}
              required
            />
          </div>

          {/* Shalat Wajib */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Prayer</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as Shalat[]
              ).map((shalat) => (
                <div
                  key={shalat}
                  className="border rounded p-2 hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span>{shalat}</span>
                    <input
                      type="checkbox"
                      checked={formData.shalatWajib.includes(shalat)}
                      onChange={(e) =>
                        handleShalatChange(shalat, e.target.checked)
                      }
                      className="ml-2"
                    />
                  </div>

                  {formData.shalatWajib.includes(shalat) && (
                    <div className="flex justify-between mt-2">
                      {["Masjid", "Rumah"].map((lokasi) => (
                        <label key={lokasi} className="flex items-center">
                          <input
                            type="radio"
                            name={`lokasi-${shalat}`}
                            checked={formData.lokasiShalat[shalat] === lokasi}
                            onChange={() =>
                              handleLokasiChange(shalat, lokasi as LokasiShalat)
                            }
                          />
                          <span className="ml-1">{lokasi}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tarawih */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tarawih Prayer</label>
            <select
              value={formData.tarawih}
              onChange={(e) =>
                handleChange("tarawih", e.target.value as TarawihOption)
              }
              className="w-full border p-2 rounded"
            >
              <option value="Tidak">Tidak</option>
              <option value="8 Rakaat">8 Rakaat</option>
              <option value="20 Rakaat">20 Rakaat</option>
            </select>
          </div>

          {/* Puasa */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Fasting</label>
            <select
              value={formData.puasa}
              onChange={(e) => handleChange("puasa", e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Puasa?</option>
              <option value="Sempurna">Ya</option>
              <option value="Tidak Sempurna">Tidak</option>
            </select>
          </div>
        </div>

        {/* Bagian 2: Tilawah & Khatam Quran */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg">
          {/* Tilawah */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tilawah Pages</label>
            <input
              type="number"
              min="0"
              placeholder="Halaman tilawah"
              value={formData.tilawah || ""}
              onChange={(e) => handleChange("tilawah", Number(e.target.value))}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Halaman Terakhir */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Page (Auto)</label>
            <input
              type="number"
              value={formData.halamanTerakhir}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Juz */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Juz</label>
            <select
              value={formData.juz}
              onChange={(e) => handleChange("juz", e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Juz?</option>
              {[...Array(30)].map((_, i) => (
                <option key={i} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Khatam Quran */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Khatam Quran</label>
            <input
              type="number"
              min="0"
              value={formData.khatamQuran}
              onChange={(e) =>
                handleChange("khatamQuran", Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-5 mt-6 rounded hover:bg-blue-600 text-[14px]"
      >
        Simpan
      </button>
    </form>
  );
}
