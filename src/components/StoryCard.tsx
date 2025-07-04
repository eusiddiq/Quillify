
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, BookOpen } from 'lucide-react';
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
  onRead: (storyId: string) => void;
}

const StoryCard = ({ story, onEdit, onDelete, onRead }: StoryCardProps) => {
  const formatCategory = (category: string | null) => {
    if (!category) return null;
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="group border-sage-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-sage-300 overflow-hidden">
      {story.cover_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={story.cover_url}
            alt={`${story.title} cover`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg text-sage-900 truncate mb-1">
              {story.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {story.category && (
                <Badge variant="outline" className="border-sage-300 text-sage-600">
                  {formatCategory(story.category)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {story.description ? (
          <p className="text-sage-600 text-sm line-clamp-3 leading-relaxed">
            {story.description}
          </p>
        ) : (
          <p className="text-sage-400 text-sm italic">
            No description available
          </p>
        )}
        <div className="flex items-center gap-1 mt-3 text-xs text-sage-500">
          <Clock className="w-3 h-3" />
          <span>
            Updated {format(new Date(story.updated_at), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRead(story.id)}
            className="flex-1 border-sage-300 text-sage-700 hover:bg-sage-50"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Read
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(story.id)}
            className="border-sage-300 text-sage-700 hover:bg-sage-50"
          >
            <Edit className="w-3 h-3" />
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
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
