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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import ImageUpload from './ImageUpload';

type StoryCategory = Database['public']['Enums']['story_category'];
type TargetAudience = Database['public']['Enums']['target_audience'];
type StoryLanguage = Database['public']['Enums']['story_language'];

interface StoryFormProps {
  storyId?: string;
  onBack: () => void;
  onSave: (storyId: string) => void;
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

const StoryForm = ({ storyId, onBack, onSave }: StoryFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<StoryCategory | ''>('');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('adult_25_plus');
  const [language, setLanguage] = useState<StoryLanguage>('english');
  const [isMature, setIsMature] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  const fetchStory = async () => {
    if (!storyId) return;
    
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
    }
  };

  const handleSave = async () => {
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
        user_id: user?.id,
        updated_at: new Date().toISOString(),
      };

      if (storyId) {
        // Update existing story
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', storyId);

        if (error) throw error;

        toast({
          title: "Story updated",
          description: "Your changes have been saved.",
        });
        onSave(storyId);
      } else {
        // Create new story
        const { data, error } = await supabase
          .from('stories')
          .insert(storyData)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Story created",
          description: "Your new story has been saved.",
        });
        onSave(data.id);
      }
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-sage-600 hover:text-sage-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-sage-900">
            {storyId ? 'Edit Story' : 'Create New Story'}
          </h1>
          <p className="text-sage-600">Set up your story details and metadata</p>
        </div>
      </div>

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
              onClick={handleSave}
              disabled={loading || !title.trim()}
              className="bg-sage-600 hover:bg-sage-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (storyId ? 'Update Story' : 'Create Story')}
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
              className="border-sage-300 text-sage-700 hover:bg-sage-50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryForm;
