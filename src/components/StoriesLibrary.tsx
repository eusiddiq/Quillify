import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import StoryCard from './StoryCard';
import EmptyStoriesState from './EmptyStoriesState';
import StoriesHeader from './StoriesHeader';
import StoryCardSkeleton from './skeletons/StoryCardSkeleton';
import { getStoryTotalWordCount } from '@/utils/wordCount';

interface Story {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  status: 'draft' | 'published';
  category: string | null;
  tags: string[] | null;
  updated_at: string;
  created_at: string;
  totalWordCount?: number;
  chapterCount?: number;
}

interface StoriesLibraryProps {
  onCreateStory: () => void;
  onEditStory: (storyId: string) => void;
  onWriteStory: (storyId: string, storyTitle: string) => void;
  onReadStory: (storyId: string) => void;
}

const StoriesLibrary = ({ onCreateStory, onEditStory, onReadStory }: StoriesLibraryProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user]);

  // Listen for hash changes to refresh stories when returning from editor
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('refresh')) {
        fetchStories();
        // Clean up the hash
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchStories = async () => {
    try {
      const { data: storiesData, error } = await supabase
        .from('stories')
        .select(`
          *,
          chapters (
            content
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Fetch chapters for each story to calculate word counts
      const storiesWithWordCounts = await Promise.all(
        (storiesData || []).map(async (story) => {
          const { data: chapters, error: chaptersError } = await supabase
            .from('chapters')
            .select('content')
            .eq('story_id', story.id);

          if (chaptersError) {
            console.error('Error fetching chapters for story:', story.id, chaptersError);
            return {
              ...story,
              totalWordCount: 0,
              chapterCount: 0
            };
          }

          const totalWordCount = getStoryTotalWordCount(chapters || []);
          const chapterCount = chapters?.length || 0;

          return {
            ...story,
            totalWordCount,
            chapterCount
          };
        })
      );

      setStories(storiesWithWordCounts);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your stories.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (storyId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      setStories(stories.filter(story => story.id !== storyId));
      toast({
        title: "Story deleted",
        description: `"${title}" has been removed from your library.`,
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the story.",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <StoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return <EmptyStoriesState onCreateStory={onCreateStory} />;
  }

  return (
    <div>
      <StoriesHeader storiesCount={stories.length} onCreateStory={onCreateStory} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onEdit={onEditStory}
            onDelete={deleteStory}
            onRead={onReadStory}
          />
        ))}
      </div>
    </div>
  );
};

export default StoriesLibrary;
