import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Admin } from "@/models/Admin";

export async function POST(req: Request) {
  try {
    const { action, email, otp, newPassword, currentPassword, newEmail } = await req.json();

    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ success: false, error: "Database offline" }, { status: 500 });

    const admin = await Admin.findOne({ username: "admin" });
    if (!admin) return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });

    // Handle Password Update via OTP
    if (action === "otp_reset") {
      if (admin.email !== email) return NextResponse.json({ success: false, error: "Email mismatch" }, { status: 400 });
      if (!admin.resetOtp || admin.resetOtp !== otp) return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
      if (admin.resetOtpExpiry && admin.resetOtpExpiry < new Date()) return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });

      admin.passwordHash = newPassword;
      admin.resetOtp = undefined;
      admin.resetOtpExpiry = undefined;
      await admin.save();

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    // Handle standard Password or Email Update from Security Page
    if (action === "update_security") {
      if (admin.passwordHash !== currentPassword) {
        return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
      }

      if (newPassword) admin.passwordHash = newPassword;
      if (newEmail) admin.email = newEmail;
      
      await admin.save();
      return NextResponse.json({ success: true, message: "Security settings updated" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json({ success: false, error: "Failed to update security settings" }, { status: 500 });
  }
}
