import { MetadataRoute } from 'next';
import { readdir } from 'fs/promises';
import { join } from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  // Get all blog posts from review directory
  let blogSlugs: string[] = [];
  try {
    const reviewPath = join(process.cwd(), 'review');
    const dirs = await readdir(reviewPath, { withFileTypes: true });
    blogSlugs = dirs
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error('Error reading review directory:', error);
  }

  const blogs = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogs,
  ];
}

