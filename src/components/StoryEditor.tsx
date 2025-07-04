import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, X, Plus, BookOpen, Trash2, Edit3, Clock } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import ImageUpload from './ImageUpload';
import StoryEditorSkeleton from './skeletons/StoryEditorSkeleton';

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

const categories: { value: StoryCategory; label: string }[] = [
  { value: 'action', label: 'Action' },
  { value: 'romance', label: 'Romance' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'sci_fi', label: 'Science Fiction' },
  { value: 'horror', label: 'Horror' },
  { value: 'drama', label: 'Drama' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'historical', label: 'Historical' },
  { value: 'young_adult', label: 'Young Adult' },
  { value: 'literary_fiction', label: 'Literary Fiction' },
];

const audiences: { value: TargetAudience; label: string }[] = [
  { value: 'young_adult_13_18', label: 'Young Adult (13-18)' },
  { value: 'new_adult_18_25', label: 'New Adult (18-25)' },
  { value: 'adult_25_plus', label: 'Adult (25+)' },
];

const languages: { value: StoryLanguage; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'arabic', label: 'Arabic' },
];

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
  const [newTag, setNewTag] = useState('');

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

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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
            <CardHeader>
              <CardTitle className="font-serif text-sage-900">Story Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <ImageUpload
                    currentImageUrl={coverUrl}
                    onImageUploaded={setCoverUrl}
                    onImageRemoved={() => setCoverUrl(null)}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sage-800 font-medium">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your story title..."
                      className="border-sage-200 focus:border-sage-400 mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sage-800 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What's your story about? This helps readers discover your work..."
                      rows={4}
                      className="border-sage-200 focus:border-sage-400 mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sage-800 font-medium">Category</Label>
                  <Select value={category} onValueChange={(value: StoryCategory) => setCategory(value)}>
                    <SelectTrigger className="border-sage-200 focus:border-sage-400 mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sage-800 font-medium">Language</Label>
                  <Select value={language} onValueChange={(value: StoryLanguage) => setLanguage(value)}>
                    <SelectTrigger className="border-sage-200 focus:border-sage-400 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sage-800 font-medium">Target Audience</Label>
                <Select value={targetAudience} onValueChange={(value: TargetAudience) => setTargetAudience(value)}>
                  <SelectTrigger className="border-sage-200 focus:border-sage-400 mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((audience) => (
                      <SelectItem key={audience.value} value={audience.value}>
                        {audience.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sage-800 font-medium">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-3 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-sage-100 text-sage-800 border-sage-300">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="border-sage-200 focus:border-sage-400"
                    disabled={tags.length >= 10}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    disabled={!newTag.trim() || tags.includes(newTag.trim()) || tags.length >= 10}
                    className="border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-sage-500 mt-1">
                  {tags.length}/10 tags used
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                <div>
                  <Label className="text-sage-800 font-medium">Mature Content</Label>
                  <p className="text-sm text-sage-600">
                    Does this story contain mature themes or explicit content?
                  </p>
                </div>
                <Switch
                  checked={isMature}
                  onCheckedChange={setIsMature}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveStory}
                  disabled={loading || !title.trim()}
                  className="bg-sage-600 hover:bg-sage-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Update Story'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chapters">
          <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-sage-900">Table of Contents</CardTitle>
                <Button
                  onClick={createNewChapter}
                  disabled={chaptersLoading}
                  className="bg-sage-600 hover:bg-sage-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chapter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {chaptersLoading ? (
                <div className="text-center py-8">
                  <p className="text-sage-500">Loading chapters...</p>
                </div>
              ) : chapters.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-sage-900 mb-2">
                    No chapters yet
                  </h3>
                  <p className="text-sage-600 mb-6">
                    Start building your story by creating your first chapter.
                  </p>
                  <Button
                    onClick={createNewChapter}
                    disabled={chaptersLoading}
                    className="bg-sage-600 hover:bg-sage-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chapter
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between p-4 border border-sage-200 rounded-lg hover:border-sage-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-sage-500 font-medium">
                            {index + 1}.
                          </span>
                          <div>
                            <h4 className="font-medium text-sage-900">
                              {chapter.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-sage-500 mt-1">
                              <Clock className="w-3 h-3" />
                              Updated {format(new Date(chapter.updated_at), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditChapter && onEditChapter(storyId, title, chapter.id)}
                          className="border-sage-300 text-sage-700 hover:bg-sage-50"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteChapter(chapter.id, chapter.title)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoryEditor;
