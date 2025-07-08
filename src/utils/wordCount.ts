/**
 * Extracts plain text from HTML content and counts words
 * @param htmlContent - HTML string from Tiptap editor
 * @returns Word count
 */
export const getWordCountFromHTML = (htmlContent: string | null): number => {
  if (!htmlContent || !htmlContent.trim()) return 0;
  
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Extract text content
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // Count words by splitting on whitespace
  const words = textContent.trim().split(/\s+/);
  
  // Return 0 if the text is empty, otherwise return word count
  return textContent.trim() === '' ? 0 : words.length;
};

/**
 * Counts words in plain text
 * @param text - Plain text string
 * @returns Word count
 */
export const getWordCount = (text: string): number => {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Calculates total word count for a story by summing all chapters
 * @param chapters - Array of chapter objects with content
 * @returns Total word count across all chapters
 */
export const getStoryTotalWordCount = (chapters: Array<{ content: string | null }>): number => {
  return chapters.reduce((total, chapter) => {
    return total + getWordCountFromHTML(chapter.content);
  }, 0);
};