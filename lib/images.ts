/**
 * lib/images.ts
 * Image generation and Sharp-based resizing
 */

import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export type ImageSize = {
  name: string;
  width: number;
  height: number;
  platform: string;
};

/**
 * Platform-specific image sizes
 */
export const IMAGE_SIZES: ImageSize[] = [
  // Blog
  { name: 'blog-hero', width: 1200, height: 630, platform: 'blog' },
  { name: 'blog-thumbnail', width: 800, height: 450, platform: 'blog' },
  
  // Facebook
  { name: 'facebook-feed', width: 1200, height: 630, platform: 'facebook' },
  { name: 'facebook-story', width: 1080, height: 1920, platform: 'facebook' },
  
  // Instagram
  { name: 'instagram-feed', width: 1080, height: 1080, platform: 'instagram' },
  { name: 'instagram-story', width: 1080, height: 1920, platform: 'instagram' },
  { name: 'instagram-reel', width: 1080, height: 1920, platform: 'instagram' },
  
  // LinkedIn
  { name: 'linkedin-feed', width: 1200, height: 627, platform: 'linkedin' },
  
  // Twitter
  { name: 'twitter-feed', width: 1200, height: 675, platform: 'twitter' },
  
  // YouTube
  { name: 'youtube-thumbnail', width: 1280, height: 720, platform: 'youtube' },
  
  // TikTok
  { name: 'tiktok-video', width: 1080, height: 1920, platform: 'tiktok' },
  
  // GBP
  { name: 'gbp-post', width: 1200, height: 900, platform: 'gbp' },
  
  // Email
  { name: 'email-header', width: 600, height: 300, platform: 'email' },
];

/**
 * Generate base image from text prompt (stub - implement with actual service)
 */
export async function generateImage(prompt: string, outputPath: string): Promise<void> {
  // TODO: Implement with actual image generation service (DALL-E, Midjourney, Stable Diffusion, etc.)
  // For now, create a placeholder colored rectangle with text
  
  const width = 1200;
  const height = 630;
  
  // Create solid color background
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#4F46E5"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" 
            fill="white" text-anchor="middle" dominant-baseline="middle">
        ${truncateText(prompt, 50)}
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`[PLACEHOLDER] Generated image: ${outputPath}`);
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Resize image to multiple platform sizes
 */
export async function resizeImage(
  sourcePath: string,
  outputDir: string,
  slug: string,
  platforms: string[]
): Promise<Map<string, string>> {
  // Create output directory
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }
  
  const resizedImages = new Map<string, string>();
  
  // Filter sizes for requested platforms
  const targetSizes = IMAGE_SIZES.filter(size => 
    platforms.includes(size.platform)
  );
  
  // Resize for each target size
  for (const size of targetSizes) {
    const outputPath = join(outputDir, `${slug}-${size.name}.png`);
    
    await sharp(sourcePath)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'center',
      })
      .png({ quality: 90 })
      .toFile(outputPath);
    
    resizedImages.set(size.name, outputPath);
    console.log(`Resized: ${size.name} (${size.width}x${size.height})`);
  }
  
  return resizedImages;
}

/**
 * Generate alt text for image (AI-assisted stub)
 */
export function generateAltText(prompt: string, context: string): string {
  // TODO: Use AI to generate descriptive alt text
  // For now, create simple descriptive text
  return `Illustration showing ${prompt} for ${context}`;
}

/**
 * Save image metadata (paths, alt texts, sizes)
 */
export type ImageMetadata = {
  slug: string;
  prompt: string;
  basePath: string;
  sizes: {
    name: string;
    path: string;
    width: number;
    height: number;
    platform: string;
    altText: string;
  }[];
};

export async function saveImageMetadata(
  metadata: ImageMetadata,
  outputPath: string
): Promise<void> {
  await writeFile(outputPath, JSON.stringify(metadata, null, 2));
}

/**
 * Complete image generation workflow
 */
export async function generateContentImages(
  slug: string,
  prompt: string,
  platforms: string[],
  context: string
): Promise<ImageMetadata> {
  const outputDir = join(process.cwd(), 'public', 'images', slug);
  const basePath = join(outputDir, `${slug}-base.png`);
  
  // 1. Generate base image
  await generateImage(prompt, basePath);
  
  // 2. Resize for all platforms
  const resizedPaths = await resizeImage(basePath, outputDir, slug, platforms);
  
  // 3. Generate alt texts
  const sizes = Array.from(resizedPaths.entries()).map(([name, path]) => {
    const sizeInfo = IMAGE_SIZES.find(s => s.name === name)!;
    return {
      name,
      path: path.replace(process.cwd(), ''),
      width: sizeInfo.width,
      height: sizeInfo.height,
      platform: sizeInfo.platform,
      altText: generateAltText(prompt, context),
    };
  });
  
  const metadata: ImageMetadata = {
    slug,
    prompt,
    basePath: basePath.replace(process.cwd(), ''),
    sizes,
  };
  
  // 4. Save metadata
  await saveImageMetadata(metadata, join(outputDir, 'metadata.json'));
  
  return metadata;
}

