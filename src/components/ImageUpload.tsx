
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

const ImageUpload = ({ currentImageUrl, onImageUploaded, onImageRemoved }: ImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    if (!user) return;

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('story-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('story-covers')
        .getPublicUrl(fileName);

      onImageUploaded(data.publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Cover image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload the image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be smaller than 5MB.",
      });
      return;
    }

    uploadImage(file);
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;
    
    try {
      // Extract file path from URL
      const urlParts = currentImageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const userId = urlParts[urlParts.length - 2];
      const filePath = `${userId}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('story-covers')
        .remove([filePath]);

      if (error) throw error;
      
      onImageRemoved();
      
      toast({
        title: "Image removed",
        description: "Cover image has been removed.",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove the image.",
      });
    }
  };

  return (
    <div>
      <Label className="text-sage-800 font-medium">Cover Image</Label>
      
      {currentImageUrl ? (
        <div className="mt-2">
          <div className="group relative w-48 h-64 bg-sage-50 rounded-lg border border-sage-200 overflow-hidden">
            <img
              src={currentImageUrl}
              alt="Story cover"
              className="w-full h-full object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={handleRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <div
            className="border-2 border-dashed border-sage-300 rounded-lg p-6 text-center cursor-pointer hover:border-sage-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-12 h-12 text-sage-400 mx-auto mb-4" />
            <p className="text-sage-600 mb-2">Click to upload a cover image</p>
            <p className="text-sm text-sage-500">PNG, JPG up to 5MB</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {!currentImageUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-3 border-sage-300 text-sage-700 hover:bg-sage-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Cover Image'}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
