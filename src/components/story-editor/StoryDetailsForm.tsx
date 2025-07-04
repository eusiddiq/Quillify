
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Save, X, Plus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import ImageUpload from '../ImageUpload';

type StoryCategory = Database['public']['Enums']['story_category'];
type TargetAudience = Database['public']['Enums']['target_audience'];
type StoryLanguage = Database['public']['Enums']['story_language'];

interface StoryDetailsFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  coverUrl: string | null;
  setCoverUrl: (url: string | null) => void;
  category: StoryCategory | '';
  setCategory: (category: StoryCategory | '') => void;
  targetAudience: TargetAudience;
  setTargetAudience: (audience: TargetAudience) => void;
  language: StoryLanguage;
  setLanguage: (language: StoryLanguage) => void;
  isMature: boolean;
  setIsMature: (mature: boolean) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  loading: boolean;
  onSave: () => void;
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

const StoryDetailsForm = ({
  title,
  setTitle,
  description,
  setDescription,
  coverUrl,
  setCoverUrl,
  category,
  setCategory,
  targetAudience,
  setTargetAudience,
  language,
  setLanguage,
  isMature,
  setIsMature,
  tags,
  setTags,
  loading,
  onSave
}: StoryDetailsFormProps) => {
  const [newTag, setNewTag] = useState('');

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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-semibold text-sage-900">Story Information</h2>
        <Button
          onClick={onSave}
          disabled={loading || !title.trim()}
          className="bg-sage-600 hover:bg-sage-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Update Story'}
        </Button>
      </div>

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
    </div>
  );
};

export default StoryDetailsForm;
