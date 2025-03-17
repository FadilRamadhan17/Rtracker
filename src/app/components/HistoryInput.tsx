"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IbadahData {
  _id: string;
  date: string;
  shalatWajib: string[];
  lokasiShalat: Record<string, string>;
  tilawah: number;
  juz: string;
  halamanTerakhir: number;
  puasa: string;
  tarawih: string;
  lokasiTarawih: string;
  khatamQuran: number;
}

export default function HistoryInput() {
  const [data, setData] = useState<IbadahData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch data from API
  useEffect(() => {
    fetch("/api/ibadah")
      .then((res) => res.json())
      .then((result) => {
        setData(Array.isArray(result.data) ? result.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/ibadah/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        alert("Data berhasil dihapus!");
      } else {
        console.error("Failed to delete entry");
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  // Navigate to edit page
  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Data Ibadah</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Tanggal</th>
                <th className="border border-gray-300 px-4 py-2">Shalat</th>
                <th className="border border-gray-300 px-4 py-2">Tilawah</th>
                <th className="border border-gray-300 px-4 py-2">Puasa</th>
                <th className="border border-gray-300 px-4 py-2">Tarawih</th>
                <th className="border border-gray-300 px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.shalatWajib.join(", ")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.tilawah} Pages
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.puasa}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.tarawih} di {item.lokasiTarawih}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
