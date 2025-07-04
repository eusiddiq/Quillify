
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface StoriesHeaderProps {
  storiesCount: number;
  onCreateStory: () => void;
}

const StoriesHeader = ({ storiesCount, onCreateStory }: StoriesHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-sage-900 mb-2">My Stories</h2>
        <p className="text-sage-600">
          {storiesCount} {storiesCount === 1 ? 'story' : 'stories'} in your library
        </p>
      </div>
      <Button 
        onClick={onCreateStory}
        className="bg-sage-600 hover:bg-sage-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Story
      </Button>
    </div>
  );
};

export default StoriesHeader;
