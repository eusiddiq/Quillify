
import StoryCardSkeleton from './skeletons/StoryCardSkeleton';

const StoriesLoadingState = () => {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <StoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default StoriesLoadingState;
