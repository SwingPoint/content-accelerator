/**
 * lib/aio.ts
 * AIO (AI Overviews) + SEO optimization validator
 */

import { validateTitle, validateDescription, checkKeywordDensity } from './keywords';
import { wordCount } from './strings';

export type ValidationResult = {
  category: string;
  item: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  score?: number;
};

export type AIOReport = {
  overallScore: number;
  results: ValidationResult[];
  summary: {
    passes: number;
    warnings: number;
    failures: number;
  };
};

/**
 * Validate blog content for SEO + AIO
 */
export function validateBlogContent(content: {
  title: string;
  description: string;
  body: string;
  keywords: string[];
  hasH1: boolean;
  hasH2: boolean;
  hasFAQ: boolean;
  hasJsonLd: boolean;
  hasCanonical: boolean;
  hasOgTags: boolean;
  imageCount: number;
  hasAltTexts: boolean;
  internalLinks: number;
  externalLinks: number;
}): AIOReport {
  const results: ValidationResult[] = [];
  
  // Title validation
  const titleValidation = validateTitle(content.title);
  results.push({
    category: 'SEO',
    item: 'Title Length',
    status: titleValidation.valid ? 'pass' : 'fail',
    message: titleValidation.recommendation || `${titleValidation.length} chars - optimal`,
    score: titleValidation.valid ? 10 : 0,
  });
  
  // Description validation
  const descValidation = validateDescription(content.description);
  results.push({
    category: 'SEO',
    item: 'Meta Description',
    status: descValidation.valid ? 'pass' : 'fail',
    message: descValidation.recommendation || `${descValidation.length} chars - optimal`,
    score: descValidation.valid ? 10 : 0,
  });
  
  // Word count (800-1200 optimal)
  const words = wordCount(content.body);
  results.push({
    category: 'Content',
    item: 'Word Count',
    status: words >= 800 && words <= 1500 ? 'pass' : 'warn',
    message: `${words} words (target: 800-1200)`,
    score: words >= 800 ? 10 : 5,
  });
  
  // Keyword density (primary keyword)
  if (content.keywords.length > 0) {
    const primaryKeyword = content.keywords[0];
    const density = checkKeywordDensity(content.body, primaryKeyword);
    results.push({
      category: 'SEO',
      item: 'Keyword Density',
      status: density >= 1 && density <= 2.5 ? 'pass' : 'warn',
      message: `${density.toFixed(2)}% for "${primaryKeyword}" (target: 1-2%)`,
      score: density >= 1 && density <= 2.5 ? 10 : 5,
    });
  }
  
  // Heading structure
  results.push({
    category: 'Structure',
    item: 'H1 Tag',
    status: content.hasH1 ? 'pass' : 'fail',
    message: content.hasH1 ? 'H1 present' : 'Missing H1',
    score: content.hasH1 ? 10 : 0,
  });
  
  results.push({
    category: 'Structure',
    item: 'H2 Tags',
    status: content.hasH2 ? 'pass' : 'warn',
    message: content.hasH2 ? 'H2 tags present' : 'No H2 tags',
    score: content.hasH2 ? 10 : 5,
  });
  
  // AIO optimizations
  results.push({
    category: 'AIO',
    item: 'FAQ Section',
    status: content.hasFAQ ? 'pass' : 'warn',
    message: content.hasFAQ ? 'FAQ section present' : 'Add FAQ for AIO optimization',
    score: content.hasFAQ ? 10 : 5,
  });
  
  results.push({
    category: 'AIO',
    item: 'JSON-LD Schema',
    status: content.hasJsonLd ? 'pass' : 'fail',
    message: content.hasJsonLd ? 'Structured data present' : 'Missing JSON-LD schema',
    score: content.hasJsonLd ? 10 : 0,
  });
  
  // Technical SEO
  results.push({
    category: 'Technical',
    item: 'Canonical URL',
    status: content.hasCanonical ? 'pass' : 'fail',
    message: content.hasCanonical ? 'Canonical set' : 'Missing canonical',
    score: content.hasCanonical ? 10 : 0,
  });
  
  results.push({
    category: 'Technical',
    item: 'Open Graph Tags',
    status: content.hasOgTags ? 'pass' : 'warn',
    message: content.hasOgTags ? 'OG tags present' : 'Missing social meta tags',
    score: content.hasOgTags ? 10 : 5,
  });
  
  // Images
  results.push({
    category: 'Content',
    item: 'Images',
    status: content.imageCount > 0 ? 'pass' : 'warn',
    message: `${content.imageCount} images`,
    score: content.imageCount > 0 ? 10 : 5,
  });
  
  results.push({
    category: 'Accessibility',
    item: 'Alt Texts',
    status: content.hasAltTexts ? 'pass' : 'fail',
    message: content.hasAltTexts ? 'All images have alt text' : 'Missing alt texts',
    score: content.hasAltTexts ? 10 : 0,
  });
  
  // Links
  results.push({
    category: 'SEO',
    item: 'Internal Links',
    status: content.internalLinks >= 2 ? 'pass' : 'warn',
    message: `${content.internalLinks} internal links (min 2 recommended)`,
    score: content.internalLinks >= 2 ? 10 : 5,
  });
  
  results.push({
    category: 'SEO',
    item: 'External Links',
    status: content.externalLinks >= 1 ? 'pass' : 'warn',
    message: `${content.externalLinks} external links`,
    score: content.externalLinks >= 1 ? 10 : 5,
  });
  
  // Calculate summary
  const passes = results.filter(r => r.status === 'pass').length;
  const warnings = results.filter(r => r.status === 'warn').length;
  const failures = results.filter(r => r.status === 'fail').length;
  
  const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
  const maxScore = results.length * 10;
  const overallScore = Math.round((totalScore / maxScore) * 100);
  
  return {
    overallScore,
    results,
    summary: { passes, warnings, failures },
  };
}

/**
 * Quick validation (for display)
 */
export function quickValidate(html: string, metadata: any): AIOReport {
  const hasH1 = /<h1[^>]*>/.test(html);
  const hasH2 = /<h2[^>]*>/.test(html);
  const hasFAQ = /faq/i.test(html);
  const hasJsonLd = /<script[^>]*type="application\/ld\+json"/.test(html);
  const hasCanonical = /<link[^>]*rel="canonical"/.test(html);
  const hasOgTags = /<meta[^>]*property="og:/.test(html);
  const imageCount = (html.match(/<img/g) || []).length;
  const hasAltTexts = imageCount > 0 && (html.match(/alt="/g) || []).length === imageCount;
  const internalLinks = (html.match(/<a[^>]*href="\/[^"]*"/g) || []).length;
  const externalLinks = (html.match(/<a[^>]*href="https?:\/\/[^"]*"/g) || []).length;
  
  return validateBlogContent({
    title: metadata.title || '',
    description: metadata.description || '',
    body: html.replace(/<[^>]*>/g, ''),
    keywords: metadata.keywords || [],
    hasH1,
    hasH2,
    hasFAQ,
    hasJsonLd,
    hasCanonical,
    hasOgTags,
    imageCount,
    hasAltTexts,
    internalLinks,
    externalLinks,
  });
}

