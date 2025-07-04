
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Save, Clock, BookOpen, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useRef } from 'react';

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface ChapterContentEditorProps {
  selectedChapter: Chapter | null;
  chapterTitle: string;
  chapterContent: string;
  saving: boolean;
  lastSaved: Date | null;
  loading: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onManualSave: () => void;
  onCreateChapter: () => void;
}

const ChapterContentEditor = ({
  selectedChapter,
  chapterTitle,
  chapterContent,
  saving,
  lastSaved,
  loading,
  onTitleChange,
  onContentChange,
  onManualSave,
  onCreateChapter
}: ChapterContentEditorProps) => {
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const wordCount = getWordCount(chapterContent);

  if (!selectedChapter) {
    return (
      <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-sage-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-sage-900 mb-2">
              Ready to Start Writing?
            </h3>
            <p className="text-sage-600 mb-6">
              Select a chapter from the sidebar or create a new one to begin writing your story.
            </p>
            <Button
              onClick={onCreateChapter}
              disabled={loading}
              className="bg-sage-600 hover:bg-sage-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Chapter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="chapter-title" className="text-sage-800 font-medium">
                Chapter Title
              </Label>
              <Input
                id="chapter-title"
                value={chapterTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Enter chapter title..."
                className="border-sage-200 focus:border-sage-400 mt-2"
              />
            </div>
            <Button
              onClick={onManualSave}
              disabled={saving}
              className="bg-sage-600 hover:bg-sage-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {saving && (
              <div className="flex items-center gap-2 text-sage-600">
                <Clock className="w-4 h-4 animate-spin" />
                <span className="text-sm">Saving...</span>
              </div>
            )}
            {lastSaved && !saving && (
              <span className="text-sm text-sage-500">
                Saved {format(lastSaved, 'HH:mm')}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Label htmlFor="chapter-content" className="text-sage-800 font-medium">
          Chapter Content
        </Label>
        <textarea
          ref={contentRef}
          id="chapter-content"
          value={chapterContent}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start writing your chapter..."
          rows={25}
          className="w-full mt-2 p-4 border border-sage-200 rounded-md focus:border-sage-400 focus:ring-2 focus:ring-sage-200 font-serif text-lg leading-relaxed resize-none"
          style={{ minHeight: '500px' }}
        />
        <p className="text-xs text-sage-500 mt-2">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </p>
      </CardContent>
    </Card>
  );
};

export default ChapterContentEditor;
