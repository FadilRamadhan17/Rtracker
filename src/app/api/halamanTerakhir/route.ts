import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Ibadah from "@/models/Ibadah";
import { parseISO } from "date-fns";

export async function GET(req: Request) {
  await connectMongoDB();

  const url = new URL(req.url);
  const beforeDate = url.searchParams.get("beforeDate");

  if (!beforeDate) {
    return NextResponse.json({ error: "Tanggal tidak valid" }, { status: 400 });
  }

  const dateObj = parseISO(beforeDate);

  try {
    const lastEntry = await Ibadah.findOne({ date: { $lt: dateObj } })
      .sort({ date: -1 })
      .select("halamanTerakhir");

    return NextResponse.json({
      halamanTerakhir: lastEntry?.halamanTerakhir || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
