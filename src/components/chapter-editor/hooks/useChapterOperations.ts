
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useChapterOperations = (storyId: string, user: { id: string } | null) => {
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chapters.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewChapter = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const nextOrderIndex = Math.max(...chapters.map(ch => ch.order_index), -1) + 1;
      
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          story_id: storyId,
          title: `Chapter ${chapters.length + 1}`,
          content: '',
          order_index: nextOrderIndex,
        })
        .select()
        .single();

      if (error) throw error;

      const newChapter = data as Chapter;
      setChapters(prev => [...prev, newChapter]);
      
      toast({
        title: "Chapter created",
        description: "New chapter added to your story.",
      });

      return newChapter;
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create new chapter.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteChapter = async (chapterId: string, chapterTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${chapterTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);

      if (error) throw error;

      setChapters(prev => prev.filter(ch => ch.id !== chapterId));

      toast({
        title: "Chapter deleted",
        description: `"${chapterTitle}" has been removed from your story.`,
      });

      return true;
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the chapter.",
      });
      return false;
    }
  };

  const updateChapter = async (chapterId: string, title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .update({
          title: title || 'Untitled Chapter',
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId);

      if (error) throw error;

      // Update the chapter in local state
      setChapters(prev => prev.map(ch => 
        ch.id === chapterId 
          ? { ...ch, title: title || 'Untitled Chapter', content: content, updated_at: new Date().toISOString() }
          : ch
      ));

      return true;
    } catch (error) {
      console.error('Update chapter error:', error);
      return false;
    }
  };

  return {
    chapters,
    loading,
    setChapters,
    fetchChapters,
    createNewChapter,
    deleteChapter,
    updateChapter,
  };
};
