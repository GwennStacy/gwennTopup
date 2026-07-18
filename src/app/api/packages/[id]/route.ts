import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Package from "@/models/Package";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    await connectToDatabase();
    const updatedPackage = await Package.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json(updatedPackage);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update package" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    await connectToDatabase();
    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete package" },
      { status: 500 }
    );
  }
}
