import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import connectToDatabase from '@/lib/db';
import { Page } from '@/models/Page';
import fs from 'fs';
import path from 'path';

const LOCAL_FILE = path.join(process.cwd(), 'cms-pages.json');

function getLocalData() {
  try {
    if (!fs.existsSync(LOCAL_FILE)) return {};
    const txt = fs.readFileSync(LOCAL_FILE, 'utf-8');
    return txt ? JSON.parse(txt) : {};
  } catch (e) {
    return {};
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageName = searchParams.get('pageName');
    
    const db = await connectToDatabase();
    
    if (!db) {
       const localData = getLocalData();
       if (pageName) {
         return NextResponse.json(localData[pageName] || { sections: {} });
       }
       return NextResponse.json(localData);
    }
    
    // Check if DB is empty to auto-seed from local JSON
    const count = await Page.countDocuments();
    if (count === 0) {
      const localData = getLocalData();
      const pagesToInsert = Object.values(localData).filter(Boolean);
      if (pagesToInsert.length > 0) {
        await Page.insertMany(pagesToInsert);
      }
    }

    if (pageName) {
      const page = await Page.findOne({ pageName });
      return NextResponse.json(page || { sections: {} });
    }
    
    const pages = await Page.find({});
    // Convert array back to dictionary object { "home": {...}, "about": {...} } for frontend compat
    const pagesObj: Record<string, any> = {};
    pages.forEach(p => {
      pagesObj[p.pageName] = p;
    });
    return NextResponse.json(pagesObj);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pageName, sections } = body;
    
    if (!pageName) return NextResponse.json({ error: 'pageName required' }, { status: 400 });

    const db = await connectToDatabase();
    if (!db) {
      const localData = getLocalData();
      localData[pageName] = { pageName, sections };
      fs.writeFileSync(LOCAL_FILE, JSON.stringify(localData, null, 2));
      return NextResponse.json(localData[pageName]);
    }
    
    const page = await Page.findOneAndUpdate(
      { pageName },
      { sections },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
