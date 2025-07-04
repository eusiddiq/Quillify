
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ChapterEditorHeaderProps {
  storyTitle: string;
  onBack: () => void;
}

const ChapterEditorHeader = ({ storyTitle, onBack }: ChapterEditorHeaderProps) => {
  return (
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
  );
};

export default ChapterEditorHeader;
