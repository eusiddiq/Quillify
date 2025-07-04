import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Clock, Trash2, Edit3 } from 'lucide-react';
import { format } from 'date-fns';

interface Story {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  status: 'draft' | 'published';
  category: string | null;
  updated_at: string;
  created_at: string;
}

interface StoriesLibraryProps {
  onCreateStory: () => void;
  onEditStory: (storyId: string) => void;
  onWriteStory: (storyId: string, storyTitle: string) => void;
}

const StoriesLibrary = ({ onCreateStory, onEditStory, onWriteStory }: StoriesLibraryProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
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

  const formatCategory = (category: string | null) => {
    if (!category) return null;
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <p className="text-sage-600">Loading your stories...</p>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 mx-auto mb-8 bg-sage-100 rounded-full flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-sage-400" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-sage-900 mb-4">
          Your Story Library Awaits
        </h3>
        <p className="text-sage-600 mb-8 max-w-md mx-auto">
          Every great writer starts with a single story. Let your imagination flow and create something beautiful.
        </p>
        <Button 
          onClick={onCreateStory}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Start Your First Story
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-sage-900 mb-2">My Stories</h2>
          <p className="text-sage-600">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} in your library
          </p>
        </div>
        <Button 
          onClick={onCreateStory}
          className="bg-sage-600 hover:bg-sage-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Story
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Card key={story.id} className="group hover:shadow-lg transition-all duration-200 border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              {story.cover_url && (
                <div className="w-full mb-3 rounded-md overflow-hidden bg-sage-50">
                  <AspectRatio ratio={3/4}>
                    <img
                      src={story.cover_url}
                      alt={`Cover for ${story.title}`}
                      className="w-full h-full object-contain"
                    />
                  </AspectRatio>
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-sage-900 line-clamp-2 mb-2">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant={story.status === 'published' ? 'default' : 'secondary'}
                      className={
                        story.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }
                    >
                      {story.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                    {story.category && (
                      <Badge variant="outline" className="text-sage-600 border-sage-300">
                        {formatCategory(story.category)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {story.description && (
                <p className="text-sage-600 text-sm line-clamp-3 mb-4">
                  {story.description}
                </p>
              )}
              <div className="flex items-center text-xs text-sage-500 mb-4">
                <Clock className="w-3 h-3 mr-1" />
                Updated {format(new Date(story.updated_at), 'MMM d, yyyy')}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => onEditStory(story.id)}
                  className="bg-sage-600 hover:bg-sage-700 flex-1"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit Story
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteStory(story.id, story.title)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoriesLibrary;
