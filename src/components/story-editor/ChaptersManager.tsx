
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Edit3, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface ChaptersManagerProps {
  chapters: Chapter[];
  chaptersLoading: boolean;
  onCreateChapter: () => void;
  onEditChapter?: (storyId: string, storyTitle: string, chapterId?: string) => void;
  onDeleteChapter: (chapterId: string, chapterTitle: string) => void;
  storyId: string;
  storyTitle: string;
}

const ChaptersManager = ({
  chapters,
  chaptersLoading,
  onCreateChapter,
  onEditChapter,
  onDeleteChapter,
  storyId,
  storyTitle
}: ChaptersManagerProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-semibold text-sage-900">Table of Contents</h2>
        <Button
          onClick={onCreateChapter}
          disabled={chaptersLoading}
          className="bg-sage-600 hover:bg-sage-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Chapter
        </Button>
      </div>

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
            onClick={onCreateChapter}
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
                  onClick={() => onEditChapter && onEditChapter(storyId, storyTitle, chapter.id)}
                  className="border-sage-300 text-sage-700 hover:bg-sage-50"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteChapter(chapter.id, chapter.title)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChaptersManager;
