/**
 * lib/strings.ts
 * String manipulation utilities for content generation
 */

/**
 * Truncate text to max length, preserving words
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Generate a URL-safe slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Count words in text
 */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Extract first N sentences
 */
export function extractSentences(text: string, count: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, count).join(' ').trim();
}

/**
 * Check for verbatim match (originality guard)
 * Returns true if any span of minLength chars matches exactly
 */
export function hasVerbatimMatch(
  text1: string,
  text2: string,
  minLength: number = 75
): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, ' ').toLowerCase().trim();
  const n1 = normalize(text1);
  const n2 = normalize(text2);
  
  for (let i = 0; i <= n1.length - minLength; i++) {
    const span = n1.slice(i, i + minLength);
    if (n2.includes(span)) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate similarity percentage (simple character-based)
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  const s1 = normalize(text1);
  const s2 = normalize(text2);
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 100;
  
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  
  return (matches / longer.length) * 100;
}

/**
 * Strip HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Generate SEO-friendly title (capitalize properly)
 */
export function toTitleCase(text: string): string {
  const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !minorWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate excerpt from text
 */
export function generateExcerpt(text: string, maxLength: number = 160): string {
  const stripped = stripHtml(text);
  const firstSentences = extractSentences(stripped, 2);
  return truncate(firstSentences, maxLength);
}

