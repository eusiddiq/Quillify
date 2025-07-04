
import { BookOpen } from 'lucide-react';

const StoriesLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <BookOpen className="w-12 h-12 text-sage-400 mx-auto mb-4" />
        <p className="text-sage-600">Loading your stories...</p>
      </div>
    </div>
  );
};

export default StoriesLoadingState;
