import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Ibadah from "@/models/Ibadah";

export async function GET() {
  try {
    await connectMongoDB();
    const dates = await Ibadah.find({}, { date: 1, _id: 0 });

    return NextResponse.json({ dates: dates.map((d) => d.date) });
  } catch (error) {
    console.error("Error fetching dates:", error);
    return new NextResponse(
      JSON.stringify({ error: "Gagal mengambil daftar tanggal" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
