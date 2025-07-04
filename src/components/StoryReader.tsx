import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Clock, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Story {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  category: string | null;
  updated_at: string;
}

interface StoryReaderProps {
  storyId: string;
  onBack: () => void;
}

const StoryReader = ({
  storyId,
  onBack
}: StoryReaderProps) => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storyId) {
      fetchStoryAndChapters();
    }
  }, [storyId]);

  const handleChapterSelect = (chapterIndex: string) => {
    setCurrentChapterIndex(parseInt(chapterIndex));
  };

  const fetchStoryAndChapters = async () => {
    try {
      // Fetch story details
      const {
        data: storyData,
        error: storyError
      } = await supabase.from('stories').select('*').eq('id', storyId).single();
      if (storyError) throw storyError;
      setStory(storyData);

      // Fetch chapters
      const {
        data: chaptersData,
        error: chaptersError
      } = await supabase.from('chapters').select('*').eq('story_id', storyId).order('order_index', {
        ascending: true
      });
      if (chaptersError) throw chaptersError;
      setChapters(chaptersData || []);
    } catch (error) {
      console.error('Error fetching story:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load story."
      });
    } finally {
      setLoading(false);
    }
  };

  const currentChapter = chapters[currentChapterIndex];
  const canGoPrevious = currentChapterIndex > 0;
  const canGoNext = currentChapterIndex < chapters.length - 1;

  const goToPreviousChapter = () => {
    if (canGoPrevious) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const goToNextChapter = () => {
    if (canGoNext) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const getWordCount = (text: string) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sage-600">Loading story...</p>
        </div>
      </div>;
  }

  if (!story || chapters.length === 0) {
    return <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="text-sage-600 hover:text-sage-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
        
        <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-sage-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold text-sage-900 mb-2">
                No chapters found
              </h3>
              <p className="text-sage-600">
                This story doesn't have any chapters to read yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>;
  }

  return <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="text-sage-600 hover:text-sage-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Button>

      {/* Story Header with Cover and Chapter Selector */}
      <div className="flex items-start gap-6 mb-8">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {story.cover_url ? <img src={story.cover_url} alt={`${story.title} cover`} className="w-24 h-32 object-contain border border-sage-200 shadow-sm bg-sage-50" /> : <div className="w-24 h-32 bg-sage-100 rounded-lg border border-sage-200 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-sage-400" />
            </div>}
        </div>

        {/* Title and Chapter Selector */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-serif font-bold text-sage-900 mb-2">
            {story.title}
          </h1>
          <p className="text-sage-600 mb-4">Reading Mode</p>
          
          {/* Chapter Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-sage-700 font-medium">Chapter:</span>
            <Select value={currentChapterIndex.toString()} onValueChange={handleChapterSelect}>
              <SelectTrigger className="w-64 border-sage-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-sage-200">
                {chapters.map((chapter, index) => <SelectItem key={chapter.id} value={index.toString()}>
                    Chapter {index + 1}: {chapter.title}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-sage-900 mb-2">
              {currentChapter.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-sage-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated {format(new Date(currentChapter.updated_at), 'MMM d, yyyy')}
              </div>
              <div>
                {getWordCount(currentChapter.content || '')} words
              </div>
            </div>
          </div>

          <div className="prose prose-sage max-w-none">
            {currentChapter.content ? <div className="font-serif text-lg leading-relaxed text-sage-800 whitespace-pre-wrap">
                {currentChapter.content}
              </div> : <div className="text-center py-12 text-sage-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>This chapter is empty.</p>
              </div>}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between mt-8 pb-8">
        <Button variant="outline" onClick={goToPreviousChapter} disabled={!canGoPrevious} className="border-sage-300 text-sage-700 hover:bg-sage-50">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous Chapter
        </Button>

        <Button variant="outline" onClick={goToNextChapter} disabled={!canGoNext} className="border-sage-300 text-sage-700 hover:bg-sage-50">
          Next Chapter
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>;
};

export default StoryReader;
