import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import connectToDatabase from "@/lib/db";
import { TeamMember } from "@/models/Team";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) return NextResponse.json([]);

    const teamMembers = await TeamMember.find({});
    return NextResponse.json(teamMembers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const member = await TeamMember.create(data);
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const { _id, ...updateData } = data;
    const member = await TeamMember.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update data" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectToDatabase();
    await TeamMember.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete data" }, { status: 500 });
  }
}
