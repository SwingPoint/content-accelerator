/**
 * Demo script to generate placeholder images for the demo content week
 * Run: npx tsx scripts/generate-demo-images.ts
 */

import { generateContentImages } from '../lib/images';

async function main() {
  console.log('🎨 Generating demo images for week-01-ai-hvac-maintenance...\n');
  
  const slug = 'week-01-ai-hvac-maintenance';
  const prompt = 'Modern HVAC system with AI technology, futuristic dashboard showing predictive maintenance analytics, professional commercial setting';
  const platforms = ['blog', 'facebook', 'instagram', 'linkedin', 'youtube', 'gbp', 'email'];
  const context = 'AI-Powered Predictive Maintenance for HVAC Systems';
  
  try {
    const metadata = await generateContentImages(slug, prompt, platforms, context);
    
    console.log('\n✅ Image generation complete!');
    console.log(`\nGenerated ${metadata.sizes.length} images:`);
    metadata.sizes.forEach(size => {
      console.log(`  • ${size.name} (${size.width}x${size.height}) for ${size.platform}`);
    });
    
    console.log(`\n📁 Images saved to: public/images/${slug}/`);
    console.log(`📄 Metadata saved to: public/images/${slug}/metadata.json`);
    
  } catch (error) {
    console.error('❌ Error generating images:', error);
    process.exit(1);
  }
}

main();

