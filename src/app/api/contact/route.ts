import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectToDatabase from "@/lib/db";
import { Contact } from "@/models/Contact";

const FILE_PATH = path.join(process.cwd(), "cms-contact.json");

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
      return NextResponse.json(localData || {
        phone: "+91 98765 43210",
        email: "info@jkconstructions.com",
        address: "Gurugram, Haryana",
        whatsapp: "+91 98765 43210",
        businessHours: ["Mon - Sat: 9:00 AM - 7:00 PM"]
      });
    }

    let contactData = await Contact.findOne();
    
    // Auto-seed from local JSON if DB is empty
    if (!contactData) {
      const localData = getLocalData();
      if (localData) {
        contactData = await Contact.create(localData);
      } else {
        contactData = await Contact.create({});
      }
    }

    return NextResponse.json(contactData);
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await connectToDatabase();
    
    if (!db) {
      // Local Fallback if DB is not connected
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      return NextResponse.json({ success: true });
    }

    // Upsert to DB
    await Contact.findOneAndUpdate({}, data, { upsert: true, new: true });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact data:", error);
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}
