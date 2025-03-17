import { NextResponse } from "next/server";
import IbadahModel from "../../../../models/Ibadah";
import connectMongoDB from "@/lib/mongodb";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    console.log("API received data:", body); // Debug log
    console.log("Updating document with ID:", id); // Debug log

    await connectMongoDB();

    const updatedIbadah = await IbadahModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedIbadah) {
      console.log("Document not found with ID:", id); // Debug log
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    console.log("Updated document:", updatedIbadah); // Debug log
    return NextResponse.json(
      { message: "Ibadah Updated", data: updatedIbadah },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Error updating data", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();
    const Ibadah = await IbadahModel.findOne({ _id: id });

    if (!Ibadah) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Ibadah founded", data: Ibadah },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error finding data:", error);
    return NextResponse.json(
      { message: "Error finding data" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();

    const deletedIbadah = await IbadahModel.findByIdAndDelete(id);

    if (!deletedIbadah) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ibadah Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "Error deleting data" },
      { status: 500 }
    );
  }
}
