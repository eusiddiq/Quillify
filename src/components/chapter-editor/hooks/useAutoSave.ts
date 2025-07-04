
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useAutoSave = (
  selectedChapter: Chapter | null,
  chapterTitle: string,
  chapterContent: string,
  originalTitle: string,
  originalContent: string,
  updateChapter: (chapterId: string, title: string, content: string) => Promise<boolean>
) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save functionality - only save if there are actual changes
  useEffect(() => {
    if (!selectedChapter) return;

    // Check if there are actual changes from the original values
    const hasChanges = 
      chapterTitle !== originalTitle || 
      chapterContent !== originalContent;

    if (!hasChanges) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2000); // Save after 2 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [chapterTitle, chapterContent, selectedChapter, originalTitle, originalContent]);

  const autoSave = async () => {
    if (!selectedChapter) return;

    setSaving(true);
    try {
      const success = await updateChapter(selectedChapter.id, chapterTitle, chapterContent);
      if (success) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const manualSave = async () => {
    if (!selectedChapter) return;
    
    setSaving(true);
    try {
      const success = await updateChapter(selectedChapter.id, chapterTitle, chapterContent);
      if (success) {
        setLastSaved(new Date());
        toast({
          title: "Chapter saved",
          description: "Your changes have been saved.",
        });
      }
    } catch (error) {
      console.error('Manual save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    lastSaved,
    setLastSaved,
    manualSave,
  };
};
