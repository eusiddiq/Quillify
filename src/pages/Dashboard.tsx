import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import StoriesLibrary from '@/components/StoriesLibrary';
import StoryForm from '@/components/StoryForm';
import StoryEditor from '@/components/StoryEditor';
import ChapterEditor from '@/components/ChapterEditor';
import StoryReader from '@/components/StoryReader';
import { KeyboardShortcuts, useKeyboardShortcuts } from '@/components/ui/keyboard-shortcuts';
import { NavigationBreadcrumb } from '@/components/ui/navigation-breadcrumb';
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
  const [storyEditorTab, setStoryEditorTab] = useState<string>('details');

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
    setStoryEditorTab('details');
    // Force refresh of stories when returning to library
    window.location.hash = `#refresh-${Date.now()}`;
  };

  const handleBackToStoryEditor = () => {
    setCurrentView('editor');
    setStoryEditorTab('chapters'); // Set to chapters tab when coming from chapter editor
    // Keep the selectedStoryId and selectedStoryData as they are
  };

  const handleStorySaved = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentView('library');
    setStoryEditorTab('details');
  };

  // Define keyboard shortcuts for the dashboard
  const shortcuts = [
    {
      key: ["Ctrl", "N"],
      description: "Create new story",
      category: "General",
      action: handleCreateStory,
    },
    {
      key: ["Ctrl", "L"],
      description: "Go to library",
      category: "Navigation", 
      action: () => setCurrentView('library'),
    },
    {
      key: ["Escape"],
      description: "Go back/cancel",
      category: "Navigation",
      action: () => {
        if (currentView !== 'library') {
          setCurrentView('library');
        }
      },
    },
    {
      key: ["?"],
      description: "Show keyboard shortcuts",
      category: "Help",
    },
  ];

  const { triggered, KeyboardShortcutsComponent } = useKeyboardShortcuts(shortcuts);

  // Generate breadcrumb items based on current view
  const getBreadcrumbItems = () => {
    const items = [];
    
    switch (currentView) {
      case 'create':
        items.push({ label: 'Create Story', current: true });
        break;
      case 'editor':
        if (selectedStoryData) {
          items.push(
            { label: selectedStoryData.title, onClick: () => setCurrentView('editor'), current: true }
          );
        } else {
          items.push({ label: 'Edit Story', current: true });
        }
        break;
      case 'write':
        if (selectedStoryData) {
          items.push(
            { label: selectedStoryData.title, onClick: () => setCurrentView('editor') },
            { label: 'Write', current: true }
          );
        } else {
          items.push({ label: 'Write', current: true });
        }
        break;
      case 'read':
        if (selectedStoryData) {
          items.push(
            { label: selectedStoryData.title, onClick: () => setCurrentView('editor') },
            { label: 'Read', current: true }
          );
        } else {
          items.push({ label: 'Read', current: true });
        }
        break;
      default:
        // Library view - no additional items needed
        break;
    }
    
    return items;
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

            <div className="flex items-center gap-3">
              <KeyboardShortcuts shortcuts={shortcuts} />
              
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
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      {currentView !== 'library' && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-sage-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <NavigationBreadcrumb
              items={getBreadcrumbItems()}
              onHomeClick={() => setCurrentView('library')}
              homeLabel="Library"
            />
          </div>
        </div>
      )}

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
            defaultTab={storyEditorTab}
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
