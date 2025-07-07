
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Plus, Feather, Lightbulb, Target } from 'lucide-react';

interface EmptyStoriesStateProps {
  onCreateStory: () => void;
}

const WritingTip = ({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>, title: string, description: string }) => (
  <Card variant="interactive" className="p-4 text-left border-sage-200 bg-white/60 backdrop-blur-sm hover:bg-white/80">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-1">
        <Icon className="w-4 h-4 text-sage-600" />
      </div>
      <div>
        <h4 className="font-medium text-sage-900 mb-1">{title}</h4>
        <p className="text-sm text-sage-600">{description}</p>
      </div>
    </div>
  </Card>
);

const EmptyStoriesState = ({ onCreateStory }: EmptyStoriesStateProps) => {
  return (
    <div className="text-center py-16 max-w-4xl mx-auto">
      {/* Main Illustration */}
      <div className="relative w-40 h-40 mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-100 to-cream-100 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-sage-500 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-sage-200 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cream-200 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <h3 className="text-3xl font-serif font-bold text-sage-900 mb-4 bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent">
        Your Story Library Awaits
      </h3>
      <p className="text-sage-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
        Every great writer starts with a single story. Let your imagination flow and create something beautiful that the world has never seen before.
      </p>

      {/* Call to Action */}
      <Button 
        onClick={onCreateStory}
        size="lg"
        className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg mb-12 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-5 h-5 mr-2" />
        Start Your First Story
      </Button>

      {/* Writing Tips */}
      <div className="grid md:grid-cols-3 gap-4 mt-12">
        <WritingTip
          icon={Feather}
          title="Start Simple"
          description="Begin with a character, a setting, or even just a single scene that excites you."
        />
        <WritingTip
          icon={Lightbulb}
          title="Find Inspiration"
          description="Draw from your experiences, dreams, or ask 'what if' questions about everyday situations."
        />
        <WritingTip
          icon={Target}
          title="Set Goals"
          description="Whether it's 500 words a day or a chapter a week, consistent progress leads to finished stories."
        />
      </div>

      {/* Motivational Quote */}
      <div className="mt-12 p-6 bg-sage-50 rounded-lg border border-sage-200">
        <blockquote className="text-sage-700 font-serif italic text-lg">
          "The first draft of anything is shit."
        </blockquote>
        <cite className="text-sage-500 text-sm mt-2 block">— Ernest Hemingway</cite>
        <p className="text-sage-600 text-sm mt-2">
          Remember: every masterpiece started as a rough draft. The magic happens in the rewriting.
        </p>
      </div>
    </div>
  );
};

export default EmptyStoriesState;
