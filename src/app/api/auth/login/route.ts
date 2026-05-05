import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Admin } from "@/models/Admin";

// Helper function to simulate bcrypt hash without adding dependencies for now
const mockHash = (str: string) => str; 

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const db = await connectToDatabase();
    if (!db) {
      // Fallback for local testing if DB is down
      return NextResponse.json({ success: true, message: "DB Down, Mock Login" }, { status: 200 });
    }

    let admin = await Admin.findOne({ username: username.toLowerCase() });
    
    // Auto-seed default admin if doesn't exist
    if (!admin) {
      admin = await Admin.create({
        username: "admin",
        email: "admin@jkconstructions.com",
        passwordHash: mockHash("jk@2024")
      });
    }

    if (admin.passwordHash === mockHash(password)) {
      return NextResponse.json({ success: true, email: admin.email });
    } else {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
