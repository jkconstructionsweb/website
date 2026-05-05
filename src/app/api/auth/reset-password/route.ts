import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Admin } from "@/models/Admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, error: "Database offline" }, { status: 500 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to Admin record with 15 mins expiry
    admin.resetOtp = otp;
    admin.resetOtpExpiry = new Date(Date.now() + 15 * 60000);
    await admin.save();

    // MOCK EMAIL SEND (Normally you would use Resend/SendGrid here)
    console.log(`\n================================`);
    console.log(`MOCK EMAIL SENT TO: ${email}`);
    console.log(`YOUR PASSWORD RESET OTP IS: ${otp}`);
    console.log(`================================\n`);

    return NextResponse.json({ success: true, message: "OTP sent to your email (Check Server Console)" });

  } catch (error) {
    console.error("OTP generation error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate OTP" }, { status: 500 });
  }
}
