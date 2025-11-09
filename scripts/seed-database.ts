/**
 * Seed the database with demo data
 * Run: npx tsx scripts/seed-database.ts
 */

import { prisma } from '../lib/db';
import { hash } from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: await hash('demo123', 10),
    },
  });
  console.log('✅ Created demo user:', demoUser.email);

  // Create workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'Demo workspace for Bay Area HVAC Pro',
    },
  });
  console.log('✅ Created workspace:', workspace.name);

  // Create membership
  const membership = await prisma.membership.upsert({
    where: {
      userId_workspaceId: {
        userId: demoUser.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      workspaceId: workspace.id,
      role: 'OWNER',
    },
  });
  console.log('✅ Created membership: OWNER');

  // Create project
  const project = await prisma.project.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'bay-area-hvac',
      },
    },
    update: {},
    create: {
      name: 'Bay Area HVAC Pro',
      slug: 'bay-area-hvac',
      workspaceId: workspace.id,
      businessName: 'Bay Area HVAC Pro',
      region: 'San Francisco, CA',
      website: 'https://bayareahvacpro.com',
      valueProp: 'Expert HVAC solutions with cutting-edge technology',
      brandVoice: 'Professional, knowledgeable, innovative',
      platforms: ['facebook', 'instagram', 'linkedin', 'gbp', 'youtube', 'email'],
      timezone: 'America/Los_Angeles',
    },
  });
  console.log('✅ Created project:', project.name);

  // Create content week
  const contentWeek = await prisma.contentWeek.upsert({
    where: {
      projectId_slug: {
        projectId: project.id,
        slug: 'week-01-ai-hvac-maintenance',
      },
    },
    update: {},
    create: {
      projectId: project.id,
      slug: 'week-01-ai-hvac-maintenance',
      topic: 'AI-Powered Predictive Maintenance for HVAC Systems',
      angle: 'Technology innovation for local businesses',
      keywords: ['HVAC', 'AI', 'predictive maintenance', 'San Francisco', 'energy efficiency'],
      hashtags: ['#HVAC', '#AITechnology', '#PredictiveMaintenance', '#SanFrancisco'],
      seedUrls: [],
      contentPath: '/review/week-01-ai-hvac-maintenance',
      status: 'DRAFT',
    },
  });
  console.log('✅ Created content week:', contentWeek.slug);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

