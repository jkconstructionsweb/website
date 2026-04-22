import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Lead } from '@/models/Lead';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectToDatabase();
    
    if (!db) {
      // Mock saving lead
      console.log("Mock lead captured:", body);
      return NextResponse.json({ success: true, message: "Lead captured successfully (Mocked)" }, { status: 201 });
    }

    const lead = await Lead.create(body);
    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json([{ name: "John Doe", phone: "9876543210", source: "Estimator", estimatedCost: "₹ 1.2 Cr", status: "New" }]);
    }
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
