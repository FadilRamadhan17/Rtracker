import { NextResponse } from "next/server";
import IbadahModel from "../../../models/Ibadah";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectMongoDB();

    const newIbadah = new IbadahModel(body);
    await newIbadah.save();

    return NextResponse.json({ message: "Ibadah Crated" }, { status: 201 });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const ibadahData = await IbadahModel.find();
    return NextResponse.json({ data: ibadahData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
