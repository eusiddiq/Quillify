
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ChapterEditorHeader from './chapter-editor/ChapterEditorHeader';
import ChaptersList from './chapter-editor/ChaptersList';
import ChapterContentEditor from './chapter-editor/ChapterContentEditor';
import { useChapterOperations } from './chapter-editor/hooks/useChapterOperations';
import { useAutoSave } from './chapter-editor/hooks/useAutoSave';

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface ChapterEditorProps {
  storyId: string;
  storyTitle: string;
  selectedChapterId?: string;
  onBack: () => void;
}

const ChapterEditor = ({ storyId, storyTitle, selectedChapterId, onBack }: ChapterEditorProps) => {
  const { user } = useAuth();
  
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');

  const {
    chapters,
    loading,
    fetchChapters,
    createNewChapter,
    deleteChapter,
    updateChapter,
  } = useChapterOperations(storyId, user);

  const {
    saving,
    lastSaved,
    setLastSaved,
    manualSave,
    saveBeforeSwitch,
  } = useAutoSave(
    selectedChapter,
    chapterTitle,
    chapterContent,
    originalTitle,
    originalContent,
    updateChapter
  );

  useEffect(() => {
    fetchChapters();
  }, [storyId]);

  // Auto-select the chapter if selectedChapterId is provided
  useEffect(() => {
    if (selectedChapterId && chapters.length > 0) {
      const targetChapter = chapters.find(ch => ch.id === selectedChapterId);
      if (targetChapter) {
        selectChapter(targetChapter);
      }
    }
  }, [selectedChapterId, chapters]);

  const selectChapter = async (chapter: Chapter) => {
    // Save current chapter before switching if there are changes
    if (selectedChapter) {
      await saveBeforeSwitch();
    }

    setSelectedChapter(chapter);
    setChapterTitle(chapter.title);
    setChapterContent(chapter.content || '');
    // Set original values to track changes
    setOriginalTitle(chapter.title);
    setOriginalContent(chapter.content || '');
    setLastSaved(null);
  };

  const handleCreateChapter = async () => {
    // Save current chapter before creating new one
    if (selectedChapter) {
      await saveBeforeSwitch();
    }

    const newChapter = await createNewChapter();
    if (newChapter) {
      setSelectedChapter(newChapter);
      setChapterTitle(newChapter.title);
      setChapterContent(newChapter.content || '');
      setOriginalTitle(newChapter.title);
      setOriginalContent(newChapter.content || '');
      setLastSaved(null);
    }
  };

  const handleDeleteChapter = async (chapterId: string, chapterTitle: string) => {
    const deleted = await deleteChapter(chapterId, chapterTitle);
    if (deleted && selectedChapter?.id === chapterId) {
      setSelectedChapter(null);
      setChapterTitle('');
      setChapterContent('');
      setOriginalTitle('');
      setOriginalContent('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ChapterEditorHeader 
        storyTitle={storyTitle}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapters Sidebar */}
        <div className="lg:col-span-1">
          <ChaptersList
            chapters={chapters}
            selectedChapter={selectedChapter}
            loading={loading}
            onSelectChapter={selectChapter}
            onCreateChapter={handleCreateChapter}
            onDeleteChapter={handleDeleteChapter}
          />
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          <ChapterContentEditor
            selectedChapter={selectedChapter}
            chapterTitle={chapterTitle}
            chapterContent={chapterContent}
            saving={saving}
            lastSaved={lastSaved}
            loading={loading}
            onTitleChange={setChapterTitle}
            onContentChange={setChapterContent}
            onManualSave={manualSave}
            onCreateChapter={handleCreateChapter}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterEditor;
