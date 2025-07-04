
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface ChaptersListProps {
  chapters: Chapter[];
  selectedChapter: Chapter | null;
  loading: boolean;
  onSelectChapter: (chapter: Chapter) => void;
  onCreateChapter: () => void;
  onDeleteChapter: (chapterId: string, chapterTitle: string) => void;
}

const ChaptersList = ({
  chapters,
  selectedChapter,
  loading,
  onSelectChapter,
  onCreateChapter,
  onDeleteChapter
}: ChaptersListProps) => {
  return (
    <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-sage-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Chapters
          </CardTitle>
          <Button
            onClick={onCreateChapter}
            size="sm"
            disabled={loading}
            className="bg-sage-600 hover:bg-sage-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <p className="text-sage-500 text-sm">Loading chapters...</p>
        ) : chapters.length === 0 ? (
          <p className="text-sage-500 text-sm">No chapters yet. Create your first chapter!</p>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`group p-3 rounded-lg border cursor-pointer transition-all ${
                selectedChapter?.id === chapter.id
                  ? 'border-sage-400 bg-sage-50'
                  : 'border-sage-200 hover:border-sage-300 hover:bg-sage-25'
              }`}
              onClick={() => onSelectChapter(chapter)}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sage-900 truncate">
                  {chapter.title}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChapter(chapter.id, chapter.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800"
                >
                  ×
                </Button>
              </div>
              <p className="text-xs text-sage-500 mt-1">
                {format(new Date(chapter.updated_at), 'MMM d, yyyy')}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ChaptersList;
