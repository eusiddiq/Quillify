
-- Create a storage bucket for story covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-covers', 'story-covers', true);

-- Create storage policies for the story-covers bucket
CREATE POLICY "Anyone can view story covers" ON storage.objects
FOR SELECT USING (bucket_id = 'story-covers');

CREATE POLICY "Users can upload story covers" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'story-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own story covers" ON storage.objects
FOR UPDATE USING (bucket_id = 'story-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own story covers" ON storage.objects
FOR DELETE USING (bucket_id = 'story-covers' AND auth.uid()::text = (storage.foldername(name))[1]);
