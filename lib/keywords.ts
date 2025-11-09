/**
 * lib/keywords.ts
 * SEO + AIO + GEO keyword optimization
 */

export type KeywordSet = {
  primary: string[];
  secondary: string[];
  local: string[];
  entities: string[];
  questions: string[];
};

/**
 * Generate keyword variations for SEO
 */
export function generateKeywordVariations(base: string): string[] {
  const variations: string[] = [base];
  
  // Add common modifiers
  const modifiers = [
    'best',
    'top',
    'guide',
    'how to',
    'tips',
    'solutions',
    'services',
    'company',
  ];
  
  modifiers.forEach(mod => {
    variations.push(`${mod} ${base}`);
    variations.push(`${base} ${mod}`);
  });
  
  return variations;
}

/**
 * Generate local SEO keywords
 */
export function generateLocalKeywords(topic: string, region: string): string[] {
  const cityParsed = region.split(',')[0].trim();
  
  return [
    `${topic} ${cityParsed}`,
    `${topic} near me`,
    `${topic} in ${cityParsed}`,
    `best ${topic} ${cityParsed}`,
    `local ${topic}`,
    `${cityParsed} ${topic} services`,
    `${cityParsed} ${topic} company`,
  ];
}

/**
 * Generate AIO (AI Overviews) optimized questions
 */
export function generateAIOQuestions(topic: string): string[] {
  const templates = [
    `What is ${topic}?`,
    `How does ${topic} work?`,
    `Why is ${topic} important?`,
    `When should you use ${topic}?`,
    `What are the benefits of ${topic}?`,
    `How much does ${topic} cost?`,
    `What are the best ${topic} solutions?`,
    `How to choose ${topic}?`,
  ];
  
  return templates;
}

/**
 * Build comprehensive keyword set
 */
export function buildKeywordSet(
  topic: string,
  region: string,
  additionalKeywords: string[] = []
): KeywordSet {
  const primary = [topic, ...additionalKeywords];
  const secondary = generateKeywordVariations(topic);
  const local = generateLocalKeywords(topic, region);
  const questions = generateAIOQuestions(topic);
  
  // Extract entities from topic (simple capitalized words)
  const entities = topic.match(/[A-Z][a-z]+/g) || [];
  
  return {
    primary,
    secondary,
    local,
    entities,
    questions,
  };
}

/**
 * Check keyword density (target 1-2%)
 */
export function checkKeywordDensity(text: string, keyword: string): number {
  const words = text.toLowerCase().split(/\s+/);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  
  let count = 0;
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const slice = words.slice(i, i + keywordWords.length).join(' ');
    if (slice === keywordWords.join(' ')) {
      count++;
    }
  }
  
  return (count / words.length) * 100;
}

/**
 * Generate hashtags from keywords
 */
export function generateHashtags(keywords: string[], maxCount: number = 10): string[] {
  const hashtags = keywords
    .map(k => {
      // Remove special chars, spaces, and camelCase
      const cleaned = k.replace(/[^\w\s]/g, '').replace(/\s+/g, '');
      return `#${cleaned}`;
    })
    .filter(h => h.length > 2 && h.length < 30)
    .slice(0, maxCount);
  
  return Array.from(new Set(hashtags)); // Remove duplicates
}

/**
 * Validate SEO title length
 */
export function validateTitle(title: string): { valid: boolean; length: number; recommendation?: string } {
  const length = title.length;
  
  if (length <= 60) {
    return { valid: true, length };
  } else if (length <= 70) {
    return { valid: true, length, recommendation: 'Consider shortening slightly' };
  } else {
    return { valid: false, length, recommendation: 'Title too long - max 70 chars' };
  }
}

/**
 * Validate meta description length
 */
export function validateDescription(desc: string): { valid: boolean; length: number; recommendation?: string } {
  const length = desc.length;
  
  if (length >= 120 && length <= 160) {
    return { valid: true, length };
  } else if (length < 120) {
    return { valid: false, length, recommendation: 'Too short - aim for 120-160 chars' };
  } else {
    return { valid: false, length, recommendation: 'Too long - max 160 chars' };
  }
}

