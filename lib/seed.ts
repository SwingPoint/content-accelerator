/**
 * lib/seed.ts
 * Seed content parsing and brief generation
 */

import * as cheerio from 'cheerio';
import { hasVerbatimMatch } from './strings';

export type SeedBrief = {
  title?: string;
  author?: string;
  date?: string;
  url?: string;
  text: string;
  bullets: string[];
  stats: { statement: string; source?: string; date?: string }[];
  entities: string[];
};

export type SeedStatus = 'ok' | 'failed' | 'not_used';

/**
 * Fetch URL content (stub - implement with fetch)
 */
export async function fetchUrl(url: string): Promise<string> {
  // TODO: Implement actual fetch with proper headers
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContentAccelerator/1.0)',
      },
    });
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch URL:', url, error);
    return '';
  }
}

/**
 * Extract text from HTML
 */
export function extractTextFromHtml(html: string): { title: string; text: string } {
  const $ = cheerio.load(html);
  
  // Remove script, style, nav, footer
  $('script, style, nav, footer, header').remove();
  
  const title = $('title').first().text().trim();
  
  // Try to find main content
  let text = $('article').text();
  if (!text) {
    text = $('main').text();
  }
  if (!text) {
    text = $('body').text();
  }
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return { title, text };
}

/**
 * Generate a quick brief from seed text
 */
export function quickBrief(seedText: string, url?: string): SeedBrief {
  // Split into sentences
  const sentences = seedText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 50);
  
  // Extract bullets (first 10 sentences)
  const bullets = sentences.slice(0, 10);
  
  // Extract stats (sentences with numbers)
  const stats = sentences
    .filter(s => /\d/.test(s))
    .slice(0, 6)
    .map(s => ({
      statement: s.trim(),
      source: url,
      date: extractDate(s),
    }));
  
  // Extract named entities (simple capitalized phrases)
  const entityMatches = seedText.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g) || [];
  const entities = Array.from(new Set(entityMatches)).slice(0, 25);
  
  return {
    text: seedText,
    bullets,
    stats,
    entities,
    url,
  };
}

/**
 * Extract date from text (simple pattern matching)
 */
function extractDate(text: string): string | undefined {
  const patterns = [
    /\b(\d{4})\b/,                          // Year
    /\b(20\d{2})\b/,                        // 20xx year
    /\b([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})\b/, // Month Day, Year
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  
  return undefined;
}

/**
 * Enforce originality - check generated content against seed
 * Returns true if content passes originality check (≥80% novel)
 */
export function enforceOriginality(generated: string, seed: string): boolean {
  // Check for verbatim spans > 75 chars
  if (hasVerbatimMatch(generated, seed, 75)) {
    console.warn('Originality check failed: verbatim match detected');
    return false;
  }
  
  return true;
}

/**
 * Parse multiple seed sources
 */
export async function parseSeedSources(
  urls: string[]
): Promise<{ briefs: SeedBrief[]; failed: string[] }> {
  const briefs: SeedBrief[] = [];
  const failed: string[] = [];
  
  for (const url of urls) {
    try {
      const html = await fetchUrl(url);
      if (!html) {
        failed.push(url);
        continue;
      }
      
      const { title, text } = extractTextFromHtml(html);
      if (text.length < 100) {
        failed.push(url);
        continue;
      }
      
      const brief = quickBrief(text, url);
      brief.title = title;
      briefs.push(brief);
    } catch (error) {
      console.error('Failed to parse seed:', url, error);
      failed.push(url);
    }
  }
  
  return { briefs, failed };
}

/**
 * Combine multiple seed briefs into one
 */
export function combineSeedBriefs(briefs: SeedBrief[]): SeedBrief {
  return {
    text: briefs.map(b => b.text).join('\n\n'),
    bullets: briefs.flatMap(b => b.bullets).slice(0, 15),
    stats: briefs.flatMap(b => b.stats).slice(0, 10),
    entities: Array.from(new Set(briefs.flatMap(b => b.entities))).slice(0, 30),
    url: briefs[0]?.url,
  };
}

