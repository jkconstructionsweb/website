import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db';
import { Blog } from '@/models/Blog';
import { Project } from '@/models/Project';

const BASE_URL = 'https://jkconstructionsgurugram.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Try to connect to DB, but don't crash sitemap if it fails
  let blogs: any[] = [];
  let projects: any[] = [];
  
  try {
    const db = await connectToDatabase();
    if (db) {
      blogs = await Blog.find({}).sort({ createdAt: -1 });
      projects = await Project.find({}).sort({ createdAt: -1 });
    }
  } catch (error) {
    console.error("Error fetching sitemap data from DB:", error);
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/estimator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Dynamic routes
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || blog.createdAt || new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: project.updatedAt || project.createdAt || new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
