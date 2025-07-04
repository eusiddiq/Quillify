
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyStoriesStateProps {
  onCreateStory: () => void;
}

const EmptyStoriesState = ({ onCreateStory }: EmptyStoriesStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-8 bg-sage-100 rounded-full flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-sage-400" />
      </div>
      <h3 className="text-2xl font-serif font-bold text-sage-900 mb-4">
        Your Story Library Awaits
      </h3>
      <p className="text-sage-600 mb-8 max-w-md mx-auto">
        Every great writer starts with a single story. Let your imagination flow and create something beautiful.
      </p>
      <Button 
        onClick={onCreateStory}
        className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Start Your First Story
      </Button>
    </div>
  );
};

export default EmptyStoriesState;
