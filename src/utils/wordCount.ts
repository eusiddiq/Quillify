/**
 * Core word counting function that exactly matches Tiptap's CharacterCount extension
 * @param text - Plain text string
 * @returns Word count
 */
const countWordsInText = (text: string): number => {
  if (!text || !text.trim()) return 0;
  
  // Use the exact same regex pattern that Tiptap's CharacterCount extension uses
  // This matches sequences of non-whitespace characters
  const words = text.trim().match(/\S+/g);
  
  return words ? words.length : 0;
};

/**
 * Extracts plain text from HTML content and counts words using Tiptap's exact algorithm
 * This now properly mimics the behavior of Tiptap's CharacterCount extension
 * @param htmlContent - HTML string from Tiptap editor
 * @returns Word count
 */
export const getWordCountFromHTML = (htmlContent: string | null): number => {
  if (!htmlContent || !htmlContent.trim()) return 0;
  
  // Create a temporary DOM element to parse HTML - same as Tiptap does internally
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Extract text content exactly as Tiptap does
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  return countWordsInText(textContent);
};

/**
 * Gets word count directly from Tiptap editor instance
 * This is the most accurate method when editor is available
 * @param editor - Tiptap editor instance
 * @returns Word count
 */
export const getWordCountFromEditor = (editor: unknown): number => {
  if (!editor || typeof editor !== 'object') return 0;
  const editorObj = editor as { storage?: { characterCount?: { words(): number } } };
  if (!editorObj.storage?.characterCount) return 0;
  return editorObj.storage.characterCount.words();
};

/**
 * Counts words in plain text using Tiptap's algorithm
 * @param text - Plain text string
 * @returns Word count
 */
export const getWordCount = (text: string): number => {
  return countWordsInText(text);
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