import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, BookOpen, Clock } from 'lucide-react';
import { format } from 'date-fns';

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
  const { toast } = useToast();
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchChapters();
  }, [storyId]);

  // New useEffect to auto-select the chapter if selectedChapterId is provided
  useEffect(() => {
    if (selectedChapterId && chapters.length > 0) {
      const targetChapter = chapters.find(ch => ch.id === selectedChapterId);
      if (targetChapter) {
        selectChapter(targetChapter);
      }
    }
  }, [selectedChapterId, chapters]);

  // Auto-save functionality - only save if there are actual changes
  useEffect(() => {
    if (!selectedChapter) return;

    // Check if there are actual changes from the original values
    const hasChanges = 
      chapterTitle !== originalTitle || 
      chapterContent !== originalContent;

    if (!hasChanges) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2000); // Save after 2 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [chapterTitle, chapterContent, selectedChapter, originalTitle, originalContent]);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chapters.",
      });
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    if (!selectedChapter || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('chapters')
        .update({
          title: chapterTitle || 'Untitled Chapter',
          content: chapterContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedChapter.id);

      if (error) throw error;

      setLastSaved(new Date());
      
      // Update the original values after successful save
      setOriginalTitle(chapterTitle);
      setOriginalContent(chapterContent);
      
      // Update the chapter in local state
      setChapters(prev => prev.map(ch => 
        ch.id === selectedChapter.id 
          ? { ...ch, title: chapterTitle || 'Untitled Chapter', content: chapterContent, updated_at: new Date().toISOString() }
          : ch
      ));
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const createNewChapter = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const nextOrderIndex = Math.max(...chapters.map(ch => ch.order_index), -1) + 1;
      
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          story_id: storyId,
          title: `Chapter ${chapters.length + 1}`,
          content: '',
          order_index: nextOrderIndex,
        })
        .select()
        .single();

      if (error) throw error;

      const newChapter = data as Chapter;
      setChapters(prev => [...prev, newChapter]);
      selectChapter(newChapter);
      
      toast({
        title: "Chapter created",
        description: "New chapter added to your story.",
      });
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create new chapter.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setChapterTitle(chapter.title);
    setChapterContent(chapter.content || '');
    // Set original values to track changes
    setOriginalTitle(chapter.title);
    setOriginalContent(chapter.content || '');
    setLastSaved(null);
  };

  const deleteChapter = async (chapterId: string, chapterTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${chapterTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);

      if (error) throw error;

      setChapters(prev => prev.filter(ch => ch.id !== chapterId));
      
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(null);
        setChapterTitle('');
        setChapterContent('');
        setOriginalTitle('');
        setOriginalContent('');
      }

      toast({
        title: "Chapter deleted",
        description: `"${chapterTitle}" has been removed from your story.`,
      });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the chapter.",
      });
    }
  };

  const manualSave = async () => {
    if (!selectedChapter) return;
    await autoSave();
    toast({
      title: "Chapter saved",
      description: "Your changes have been saved.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-sage-600 hover:text-sage-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-sage-900 mb-2">
            {storyTitle}
          </h1>
          <p className="text-sage-600">Chapter Editor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-sage-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Chapters
                </CardTitle>
                <Button
                  onClick={createNewChapter}
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
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedChapter?.id === chapter.id
                        ? 'border-sage-400 bg-sage-50'
                        : 'border-sage-200 hover:border-sage-300 hover:bg-sage-25'
                    }`}
                    onClick={() => selectChapter(chapter)}
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
                          deleteChapter(chapter.id, chapter.title);
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
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {selectedChapter ? (
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
                        onChange={(e) => setChapterTitle(e.target.value)}
                        placeholder="Enter chapter title..."
                        className="border-sage-200 focus:border-sage-400 mt-2"
                      />
                    </div>
                    <Button
                      onClick={manualSave}
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
                  onChange={(e) => setChapterContent(e.target.value)}
                  placeholder="Start writing your chapter..."
                  rows={25}
                  className="w-full mt-2 p-4 border border-sage-200 rounded-md focus:border-sage-400 focus:ring-2 focus:ring-sage-200 font-serif text-lg leading-relaxed resize-none"
                  style={{ minHeight: '500px' }}
                />
                <p className="text-xs text-sage-500 mt-2">
                  Auto-saves every 2 seconds while typing
                </p>
              </CardContent>
            </Card>
          ) : (
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
                    onClick={createNewChapter}
                    disabled={loading}
                    className="bg-sage-600 hover:bg-sage-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chapter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterEditor;
