import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import StoriesLibrary from '@/components/StoriesLibrary';
import StoryForm from '@/components/StoryForm';
import StoryEditor from '@/components/StoryEditor';
import ChapterEditor from '@/components/ChapterEditor';
import StoryReader from '@/components/StoryReader';
import { LogOut, Settings, User, Feather } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type View = 'library' | 'create' | 'editor' | 'write' | 'read';

interface StoryData {
  id: string;
  title: string;
  selectedChapterId?: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('library');
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>();
  const [selectedStoryData, setSelectedStoryData] = useState<StoryData | null>(null);

  const handleCreateStory = () => {
    setSelectedStoryId(undefined);
    setSelectedStoryData(null);
    setCurrentView('create');
  };

  const handleEditStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setSelectedStoryData(null);
    setCurrentView('editor');
  };

  const handleWriteStory = (storyId: string, storyTitle: string, chapterId?: string) => {
    setSelectedStoryId(storyId);
    setSelectedStoryData({ id: storyId, title: storyTitle, selectedChapterId: chapterId });
    setCurrentView('write');
  };

  const handleReadStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setSelectedStoryData(null);
    setCurrentView('read');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedStoryId(undefined);
    setSelectedStoryData(null);
  };

  const handleBackToStoryEditor = () => {
    setCurrentView('editor');
    // Keep the selectedStoryId and selectedStoryData as they are
  };

  const handleStorySaved = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentView('library');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-sage-600 rounded-full">
                <Feather className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-sage-900">Quillify</h1>
                <p className="text-sm text-sage-600">Your digital writing sanctuary</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-sage-700 hover:text-sage-900">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Welcome, {user?.user_metadata?.display_name || user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <User className="w-4 h-4 mr-2" />
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'library' && (
          <StoriesLibrary
            onCreateStory={handleCreateStory}
            onEditStory={handleEditStory}
            onWriteStory={handleWriteStory}
            onReadStory={handleReadStory}
          />
        )}

        {currentView === 'create' && (
          <StoryForm
            storyId={selectedStoryId}
            onBack={handleBackToLibrary}
            onSave={handleStorySaved}
          />
        )}

        {currentView === 'editor' && selectedStoryId && (
          <StoryEditor
            storyId={selectedStoryId}
            onBack={handleBackToLibrary}
            onEditChapter={handleWriteStory}
          />
        )}

        {currentView === 'write' && selectedStoryData && (
          <ChapterEditor
            storyId={selectedStoryData.id}
            storyTitle={selectedStoryData.title}
            selectedChapterId={selectedStoryData.selectedChapterId}
            onBack={handleBackToStoryEditor}
          />
        )}

        {currentView === 'read' && selectedStoryId && (
          <StoryReader
            storyId={selectedStoryId}
            onBack={handleBackToLibrary}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
