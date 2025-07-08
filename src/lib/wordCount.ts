export const countWords = (text: string | null): number => {
  if (!text || text.trim() === '') return 0;
  
  // Remove HTML tags and normalize whitespace
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (cleanText === '') return 0;
  
  return cleanText.split(' ').length;
};

export const formatWordCount = (count: number): string => {
  if (count === 0) return '0 words';
  if (count === 1) return '1 word';
  if (count < 1000) return `${count} words`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k words`;
  return `${(count / 1000000).toFixed(1)}M words`;
};