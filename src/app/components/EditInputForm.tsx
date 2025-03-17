"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type Shalat = "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";
type LokasiShalat = "Rumah" | "Masjid";
type TarawihOption = "Tidak" | "8 Rakaat" | "20 Rakaat";

type FormDataType = {
  _id?: string;
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

export default function EditDailyIbadahForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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

  const id =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : null;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/ibadah?id=${id}`);
        const result = await response.json();

        if (result.data) {
          const fetchedData = result.data.find(
            (item: FormDataType) => String(item._id) === String(id)
          );

          if (fetchedData) {
            setFormData({
              _id: String(fetchedData._id),
              date: fetchedData.date
                ? new Date(fetchedData.date).toISOString().split("T")[0]
                : "",
              puasa: fetchedData.puasa || "",
              tilawah: fetchedData.tilawah || 0,
              juz: fetchedData.juz || "",
              halamanTerakhir: fetchedData.halamanTerakhir || 0,
              shalatWajib: fetchedData.shalatWajib || [],
              lokasiShalat: fetchedData.lokasiShalat || {},
              tarawih: fetchedData.tarawih || "Tidak",
              lokasiTarawih: fetchedData.lokasiTarawih || "Masjid",
              khatamQuran: fetchedData.khatamQuran || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field: keyof FormDataType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      halamanTerakhir:
        field === "tilawah"
          ? prev.halamanTerakhir + value
          : prev.halamanTerakhir,
    }));
  };

  const handleShalatChange = (shalat: Shalat, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      shalatWajib: checked
        ? [...prev.shalatWajib, shalat]
        : prev.shalatWajib.filter((s) => s !== shalat),
    }));
  };

  const handleLokasiChange = (shalat: Shalat, lokasi: LokasiShalat) => {
    setFormData((prev) => ({
      ...prev,
      lokasiShalat: { ...prev.lokasiShalat, [shalat]: lokasi },
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm("Are you sure you want to update this form?")) return;

    try {
      console.log("Submitting form data:", formData); // Debug log

      const response = await fetch(`/api/ibadah/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("API response:", result); // Debug log

      if (!response.ok) {
        throw new Error(result.message || "Failed to update data");
      }

      alert("Data berhasil diperbarui!");
      router.push("/history");
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan: " + err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full mx-auto"
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
              disabled
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
        Update
      </button>
    </form>
  );
}
