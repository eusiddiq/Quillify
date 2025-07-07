
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SaveStatus } from '@/components/ui/save-status';
import { Save, Clock, BookOpen, Plus, PenTool, Zap } from 'lucide-react';
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
      <Card variant="elevated" className="border-sage-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            {/* Animated illustration */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-sage-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full shadow-sm flex items-center justify-center">
                <PenTool className="w-8 h-8 text-sage-500 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-sage-300 rounded-full animate-ping"></div>
            </div>

            <h3 className="text-2xl font-serif font-semibold text-sage-900 mb-3">
              Ready to Start Writing?
            </h3>
            <p className="text-sage-600 mb-6 leading-relaxed">
              Select a chapter from the sidebar or create your first chapter to begin crafting your story.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={onCreateChapter}
                loading={loading}
                size="lg"
                className="bg-sage-600 hover:bg-sage-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Chapter
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-sage-300 text-sage-700 hover:bg-sage-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Start Tips
              </Button>
            </div>

            {/* Writing prompt */}
            <div className="mt-8 p-4 bg-sage-50 rounded-lg border border-sage-200">
              <p className="text-sage-700 text-sm italic">
                "Every chapter is a doorway to new possibilities. What will yours reveal?"
              </p>
            </div>
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
              loading={saving}
              className="bg-sage-600 hover:bg-sage-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <SaveStatus
              status={saving ? "saving" : "saved"}
              lastSaved={lastSaved}
              autoHide={false}
              showBadge={true}
            />
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
