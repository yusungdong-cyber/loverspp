export interface SeoScoreResult {
  keywordDensity: number;
  keywordDensityScore: number;
  readabilityScore: number;
  headingStructureScore: number;
  metaDescriptionScore: number;
  contentLengthScore: number;
  overallScore: number;
  suggestions: string[];
}

function countOccurrences(text: string, keyword: string): number {
  const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  return (text.match(regex) || []).length;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = countWords(text);
  const avgWordsPerSentence = words / Math.max(sentences.length, 1);

  // Simplified readability: penalize very long sentences
  if (avgWordsPerSentence <= 15) return 100;
  if (avgWordsPerSentence <= 20) return 85;
  if (avgWordsPerSentence <= 25) return 70;
  if (avgWordsPerSentence <= 30) return 55;
  return 40;
}

function countHeadings(html: string): { h1: number; h2: number; h3: number } {
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const h2 = (html.match(/<h2[\s>]/gi) || []).length;
  const h3 = (html.match(/<h3[\s>]/gi) || []).length;
  return { h1, h2, h3 };
}

export function calculateSeoScore(
  content: string,
  htmlContent: string,
  keyword: string,
  metaDescription?: string
): SeoScoreResult {
  const suggestions: string[] = [];
  const wordCount = countWords(content);

  // 1. Keyword density (target: 1.0% - 1.5%)
  const keywordCount = countOccurrences(content, keyword);
  const keywordDensity = (keywordCount / Math.max(wordCount, 1)) * 100;
  let keywordDensityScore: number;

  if (keywordDensity >= 1.0 && keywordDensity <= 1.5) {
    keywordDensityScore = 100;
  } else if (keywordDensity >= 0.7 && keywordDensity <= 2.0) {
    keywordDensityScore = 75;
  } else if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
    keywordDensityScore = 50;
  } else {
    keywordDensityScore = 25;
    suggestions.push(
      keywordDensity < 0.5
        ? `Increase keyword density from ${keywordDensity.toFixed(1)}% to 1.0-1.5%`
        : `Reduce keyword density from ${keywordDensity.toFixed(1)}% to 1.0-1.5%`
    );
  }

  // 2. Readability
  const readabilityScore = calculateReadability(content);
  if (readabilityScore < 70) {
    suggestions.push("Use shorter sentences to improve readability");
  }

  // 3. Heading structure
  const headings = countHeadings(htmlContent);
  let headingStructureScore = 0;

  if (headings.h1 === 1) headingStructureScore += 30;
  else suggestions.push("Article should have exactly one H1 tag");

  if (headings.h2 >= 5) headingStructureScore += 50;
  else if (headings.h2 >= 3) headingStructureScore += 35;
  else suggestions.push("Add more H2 subheadings (recommended: 5+)");

  if (headings.h3 >= 2) headingStructureScore += 20;
  else headingStructureScore += 10;

  // 4. Meta description
  let metaDescriptionScore = 0;
  if (metaDescription) {
    if (metaDescription.length >= 120 && metaDescription.length <= 160) {
      metaDescriptionScore = 100;
    } else if (metaDescription.length >= 80 && metaDescription.length <= 200) {
      metaDescriptionScore = 70;
    } else {
      metaDescriptionScore = 40;
      suggestions.push("Meta description should be 120-160 characters");
    }

    if (!metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      metaDescriptionScore -= 20;
      suggestions.push("Include the primary keyword in the meta description");
    }
  } else {
    suggestions.push("Add a meta description");
  }

  // 5. Content length
  let contentLengthScore: number;
  if (wordCount >= 1200 && wordCount <= 1800) {
    contentLengthScore = 100;
  } else if (wordCount >= 800 && wordCount <= 2500) {
    contentLengthScore = 70;
  } else {
    contentLengthScore = 40;
    suggestions.push(`Content is ${wordCount} words. Target: 1200-1800 words`);
  }

  // Overall score (weighted)
  const overallScore = Math.round(
    keywordDensityScore * 0.25 +
      readabilityScore * 0.2 +
      headingStructureScore * 0.25 +
      metaDescriptionScore * 0.15 +
      contentLengthScore * 0.15
  );

  return {
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    keywordDensityScore,
    readabilityScore,
    headingStructureScore,
    metaDescriptionScore,
    contentLengthScore,
    overallScore,
    suggestions,
  };
}
