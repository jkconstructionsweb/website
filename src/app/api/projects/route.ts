import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Project } from '@/models/Project';

const mockProjects = [
  {
    title: "Luxury Villa in Sector 42",
    slug: "luxury-villa-sec-42",
    category: "Residential",
    cost: "₹2.5 Cr+",
    location: "Sector 42, Gurugram",
    timeline: "12 Months",
    description: "A breathtaking 4BHK fully-furnished luxury villa with integrated smart home features, landscaped gardens, a private pool, and premium Italian marble flooring throughout. Built to the highest structural standards with a modern MD3 design philosophy, this project redefines upscale residential living in Gurugram.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
    ],
    featured: true
  },
  {
    title: "Modern Corporate Headquarters",
    slug: "modern-office",
    category: "Commercial",
    cost: "₹5 Cr+",
    location: "Cyber City, Gurugram",
    timeline: "8 Months",
    description: "A state-of-the-art 12,000 sq.ft corporate headquarters featuring open-plan collaborative zones, premium glass partitions, a rooftop lounge, and a smart energy management system.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
    ],
    featured: true
  }
];

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(mockProjects);
    }
    
    let projects = await Project.find({}).sort({ createdAt: -1 });
    
    // Auto-seed
    if (projects.length === 0) {
      projects = await Project.insertMany(mockProjects);
    }
    
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ success: false, error: "No DB" }, { status: 500 });
    
    const project = await Project.create(data);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ success: false, error: "No DB" }, { status: 500 });
    
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
