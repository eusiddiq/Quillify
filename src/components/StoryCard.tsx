
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Clock, Trash2, Edit3 } from 'lucide-react';
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

interface StoryCardProps {
  story: Story;
  onEdit: (storyId: string) => void;
  onDelete: (storyId: string, title: string) => void;
}

const formatCategory = (category: string | null) => {
  if (!category) return null;
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const StoryCard = ({ story, onEdit, onDelete }: StoryCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-sage-200 bg-white/80 backdrop-blur-sm">
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
            onClick={() => onEdit(story.id)}
            className="bg-sage-600 hover:bg-sage-700 flex-1"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit Story
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(story.id, story.title)}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryCard;
