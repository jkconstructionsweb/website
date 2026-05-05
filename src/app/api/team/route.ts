import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import connectToDatabase from "@/lib/db";
import { TeamMember } from "@/models/Team";

const FILE_PATH = path.join(process.cwd(), "cms-team.json");

function getLocalData() {
  try {
    if (!fs.existsSync(FILE_PATH)) return null;
    const txt = fs.readFileSync(FILE_PATH, "utf-8");
    return txt ? JSON.parse(txt) : null;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    if (!db) {
      const localData = getLocalData();
      return NextResponse.json(localData || []);
    }

    let teamMembers = await TeamMember.find({});
    
    // Auto-seed from local JSON if DB is empty
    if (teamMembers.length === 0) {
      const localData = getLocalData();
      if (localData && Array.isArray(localData) && localData.length > 0) {
        teamMembers = await TeamMember.insertMany(localData);
      }
    }

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await connectToDatabase();
    
    if (!db) {
      // Local Fallback
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      return NextResponse.json({ success: true });
    }

    // Since the frontend sends the full array, replace all
    await TeamMember.deleteMany({});
    if (data && data.length > 0) {
      await TeamMember.insertMany(data);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving team data:", error);
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}
