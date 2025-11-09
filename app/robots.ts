import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/blog/', '/'],
        disallow: ['/app/', '/api/', '/review/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web'],
        allow: ['/blog/', '/'],
        disallow: ['/app/', '/api/', '/review/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

