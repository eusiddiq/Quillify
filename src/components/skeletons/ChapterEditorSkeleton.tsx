
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ChapterEditorSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="w-full h-96" />
          <Skeleton className="h-3 w-20 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChapterEditorSkeleton;
