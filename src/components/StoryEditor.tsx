
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit3, BookOpen } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import StoryEditorSkeleton from './skeletons/StoryEditorSkeleton';
import StoryDetailsForm from './story-editor/StoryDetailsForm';
import ChaptersManager from './story-editor/ChaptersManager';

type StoryCategory = Database['public']['Enums']['story_category'];
type TargetAudience = Database['public']['Enums']['target_audience'];
type StoryLanguage = Database['public']['Enums']['story_language'];

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface StoryEditorProps {
  storyId: string;
  onBack: () => void;
  onEditChapter?: (storyId: string, storyTitle: string, chapterId?: string) => void;
  defaultTab?: string;
}

const StoryEditor = ({ storyId, onBack, onEditChapter, defaultTab = 'details' }: StoryEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Story details state
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<StoryCategory | ''>('');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('adult_25_plus');
  const [language, setLanguage] = useState<StoryLanguage>('english');
  const [isMature, setIsMature] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Chapters state
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  useEffect(() => {
    if (storyId) {
      fetchStory();
      fetchChapters();
    }
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (error) throw error;

      setTitle(data.title || '');
      setDescription(data.description || '');
      setCoverUrl(data.cover_url);
      setCategory(data.category || '');
      setTargetAudience(data.target_audience || 'adult_25_plus');
      setLanguage(data.language || 'english');
      setIsMature(data.is_mature || false);
      setTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching story:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load story details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    setChaptersLoading(true);
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
      setChaptersLoading(false);
    }
  };

  const handleSaveStory = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Story title is required.",
      });
      return;
    }

    setLoading(true);

    try {
      const storyData = {
        title: title.trim(),
        description: description.trim() || null,
        cover_url: coverUrl,
        category: category || null,
        target_audience: targetAudience,
        language,
        is_mature: isMature,
        tags,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', storyId);

      if (error) throw error;

      toast({
        title: "Story updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error('Error saving story:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save story.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewChapter = async () => {
    if (!user) return;

    setChaptersLoading(true);
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
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create new chapter.",
      });
    } finally {
      setChaptersLoading(false);
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
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the chapter.",
      });
    }
  };

  if (loading) {
    return <StoryEditorSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="text-sage-600 hover:text-sage-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-sage-900 mb-2">
          {title || 'Untitled Story'}
        </h1>
        <p className="text-sage-600">Edit your story details and manage chapters</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Story Details
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Table of Contents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <StoryDetailsForm
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                coverUrl={coverUrl}
                setCoverUrl={setCoverUrl}
                category={category}
                setCategory={setCategory}
                targetAudience={targetAudience}
                setTargetAudience={setTargetAudience}
                language={language}
                setLanguage={setLanguage}
                isMature={isMature}
                setIsMature={setIsMature}
                tags={tags}
                setTags={setTags}
                loading={loading}
                onSave={handleSaveStory}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chapters">
          <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <ChaptersManager
                chapters={chapters}
                chaptersLoading={chaptersLoading}
                onCreateChapter={createNewChapter}
                onEditChapter={onEditChapter}
                onDeleteChapter={deleteChapter}
                storyId={storyId}
                storyTitle={title}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoryEditor;
