import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, BookOpen, FileText, Hash } from 'lucide-react';
import { format } from 'date-fns';
interface Story {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  category: string | null;
  tags: string[] | null;
  updated_at: string;
  created_at: string;
  totalWordCount?: number;
  chapterCount?: number;
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
        <div className="relative h-48 w-full overflow-hidden bg-sage-50">
          <img
            src={story.cover_url}
            alt={`${story.title} cover`}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg text-sage-900 truncate mb-1">
              {story.title}
            </h3>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {story.category && (
                <Badge variant="outline" className="border-sage-300 text-sage-600">
                  {formatCategory(story.category)}
                </Badge>
              )}
              {story.tags && story.tags.length > 0 && (
                story.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-sage-100 text-sage-700 text-xs">
                    {tag}
                  </Badge>
                ))
              )}
              {story.tags && story.tags.length > 3 && (
                <Badge variant="secondary" className="bg-sage-100 text-sage-700 text-xs">
                  +{story.tags.length - 3}
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
        <div className="flex items-center justify-between mt-3 text-xs text-sage-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              Updated {format(new Date(story.updated_at), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {story.chapterCount !== undefined && (
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{story.chapterCount} {story.chapterCount === 1 ? 'chapter' : 'chapters'}</span>
              </div>
            )}
            {story.totalWordCount !== undefined && (
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{story.totalWordCount.toLocaleString()} words</span>
              </div>
            )}
          </div>
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
