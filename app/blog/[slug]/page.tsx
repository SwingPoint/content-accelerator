import { readFile } from 'fs/promises';
import { join } from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

async function getBlogPost(slug: string) {
  try {
    const reviewPath = join(process.cwd(), 'review', slug);
    const indexData = await readFile(join(reviewPath, 'index.json'), 'utf-8');
    const index = JSON.parse(indexData);
    
    const blogContent = await readFile(join(reviewPath, 'blog.md'), 'utf-8');
    
    return {
      index,
      content: blogContent,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { index } = post;
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}/blog/${params.slug}`;
  
  return {
    title: index.assets.blog.title,
    description: index.assets.blog.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: index.assets.blog.title,
      description: index.assets.blog.metaDescription,
      url: canonicalUrl,
      type: 'article',
      publishedTime: index.createdAt,
      images: [
        {
          url: `${baseUrl}/images/${params.slug}/blog-hero.png`,
          width: 1200,
          height: 630,
          alt: index.assets.blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: index.assets.blog.title,
      description: index.assets.blog.metaDescription,
      images: [`${baseUrl}/images/${params.slug}/blog-hero.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  const { index, content } = post;
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  // Convert markdown to HTML sections
  const sections = content.split('\n## ').slice(1);
  const intro = content.split('\n## ')[0].replace(/^#\s+/, '');
  
  // Extract FAQ section
  const faqSection = sections.find(s => s.startsWith('FAQ'));
  const faqItems = faqSection 
    ? faqSection.split('\n\n').slice(1).filter(q => q.startsWith('**Q:'))
    : [];
  
  // JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: index.assets.blog.title,
    description: index.assets.blog.metaDescription,
    image: `${baseUrl}/images/${params.slug}/blog-hero.png`,
    datePublished: index.createdAt,
    dateModified: index.createdAt,
    author: {
      '@type': 'Organization',
      name: index.metadata.businessName,
    },
    publisher: {
      '@type': 'Organization',
      name: index.metadata.businessName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${params.slug}`,
    },
  };

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item: string) => {
      const [question, ...answerParts] = item.split('\n');
      const answer = answerParts.join('\n').trim();
      return {
        '@type': 'Question',
        name: question.replace(/\*\*Q:\s*/, '').replace(/\*\*/g, ''),
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer.replace(/\*\*A:\s*/, '').replace(/\*\*/g, ''),
        },
      };
    }),
  } : null;

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Blog Post */}
      <article className="min-h-screen bg-white">
        {/* Hero Image */}
        <div className="w-full h-[400px] bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
              {index.assets.blog.title}
            </h1>
            <p className="text-lg opacity-90">
              {index.metadata.businessName} • {index.metadata.region}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/^#\s+.*\n\n/, '') // Remove H1
                .replace(/## /g, '<h2>')
                .replace(/### /g, '<h3>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/<h2>/g, '</p><h2>')
                .replace(/<h3>/g, '</p><h3>')
                .replace(/\n/g, ' ')
                .split('</p>').map(p => p + '</p>').join('')
            }} />
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-gray-700 mb-6">
              Contact {index.metadata.businessName} for a free consultation and discover
              how we can help your business succeed.
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              Schedule Your Free Assessment
            </button>
          </div>

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">About {index.metadata.businessName}</h3>
            <p className="text-gray-700">
              Serving {index.metadata.region} with expert HVAC solutions combining
              decades of experience with cutting-edge technology. Our certified technicians
              deliver unmatched service and reliability.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}

