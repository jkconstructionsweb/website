import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import connectToDatabase from '@/lib/db';
import { Blog } from '@/models/Blog';

const mockBlogs = [
  {
    title: "10 Things to Know Before Building a Home in Gurugram",
    slug: "10-things-before-building-home-gurugram",
    category: "Tips & Advice",
    featuredImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Planning your dream home in Gurugram? Here are the ten most critical factors every homeowner must understand before breaking ground.",
    content: `Building a home in Gurugram is one of the most rewarding and complex financial decisions of your life. The city has transformed dramatically over the last decade, with premium micro-markets emerging across sectors like 42, 57, and the Golf Course Extension Road.\n\nBefore you begin, here are 10 critical things you must know:\n\n**1. Understand RERA Compliance**\nEvery residential project must be registered under the Real Estate Regulatory Authority. Always verify the builder's RERA number before signing any agreement.\n\n**2. Soil Testing is Non-Negotiable**\nGurugram's landscape varies significantly. Soft zones near Aravalli foothills require special foundation engineering. Never skip geotechnical surveys.\n\n**3. Municipal Approvals**\nObtain approvals from the Municipal Corporation of Gurugram (MCG) or Haryana Urban Development Authority (HUDA) as applicable.\n\n**4. Calculate Total Cost of Ownership**\nAdd stamp duty (7% for men, 5% for women in Haryana), registration fees, GST, and legal charges when planning your budget.\n\n**5. Choose the Right Structural Engineer**\nFor any plotted build, your structural engineer's calculations are as important as your architect's designs.\n\n**6. Water Supply Planning**\nPublic water supply in many sectors is intermittent. Plan for a dedicated borewell or water storage system from day one.\n\n**7. Electrical Load Sanctioning**\nApply for adequate DHBVN load sanctioning early. Delays here can delay your occupancy certificate.\n\n**8. Material Procurement Strategy**\nBuy structural steel and cement in bulk during price dips. These two commodities alone can swing your budget by 8–12%.\n\n**9. Timeline Buffers**\nAlways add a 15–20% timeline buffer for government approval delays and monsoon disruptions.\n\n**10. Hire the Right Construction Partner**\nChoose a contractor with ISO certification, a proven local portfolio, and transparent pricing. At JK Constructions, all three come standard.`,
    author: "Jagdish Kumar",
    authorRole: "Founder & CEO",
    authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
    readTime: "7 min read",
    tags: ["Construction Tips", "Gurugram", "Home Building", "RERA"],
    featured: true
  },
  {
    title: "Material Design 3 Principles Applied to Modern Architecture",
    slug: "material-design-3-modern-architecture",
    category: "Design Trends",
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    excerpt: "How Google's Material Design 3 philosophy is reshaping interior and exterior architectural design language in premium residential projects.",
    content: `Material Design 3, Google's most sophisticated design system to date, has profound implications beyond digital interfaces. Its core principles — dynamic colour, elevated surfaces, and expressive typography — are now inspiring a new generation of architectural and interior design.\n\n**Dynamic Colour in Spaces**\nMD3's color token system encourages adaptive, contextual use of color. In architecture, this translates to surfaces that change character with lighting conditions — matte concrete in daylight shifting to warm amber under evening illumination.\n\n**Elevation and Surface Depth**\nMD3's elevation system uses shadow and material layering to create depth. Applied architecturally, this means tiered facade treatments: a primary structural face set back behind a floating screen of perforated metal or timber battens.\n\n**Rounded Language**\nThe 16–28px corner radius in MD3 directly parallels the curved-corner construction movement, where sharp 90° joints are being replaced with bullnosed brick courses, rounded column wraps, and arched doorways.\n\n**What This Means for Your Next Project**\nIf you are planning a premium residence or commercial space, incorporating MD3-adjacent design principles signals forward-thinking aesthetics that age gracefully rather than chasing fleeting trends.`,
    author: "Priya Sharma",
    authorRole: "Chief Architect",
    authorImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=100&q=80",
    readTime: "5 min read",
    tags: ["Design", "Architecture", "MD3", "Interiors"],
    featured: true
  }
];

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(mockBlogs);
    }
    
    let blogs = await Blog.find({}).sort({ createdAt: -1 });
    
    // Auto-seed
    if (blogs.length === 0) {
      blogs = await Blog.insertMany(mockBlogs);
    }
    
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ success: false, error: "No DB" }, { status: 500 });
    
    const blog = await Blog.create(data);
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ success: false, error: "No DB" }, { status: 500 });
    
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ success: false, error: "No DB" }, { status: 500 });
    
    const { _id, ...updateData } = data;
    const blog = await Blog.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
  }
}
