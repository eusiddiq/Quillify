
-- Create enum types for story metadata
CREATE TYPE public.story_status AS ENUM ('draft', 'published');
CREATE TYPE public.story_category AS ENUM ('action', 'romance', 'fantasy', 'mystery', 'sci_fi', 'horror', 'drama', 'comedy', 'thriller', 'historical', 'young_adult', 'literary_fiction');
CREATE TYPE public.target_audience AS ENUM ('young_adult_13_18', 'new_adult_18_25', 'adult_25_plus');
CREATE TYPE public.story_language AS ENUM ('english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'chinese', 'japanese', 'korean', 'arabic');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create stories table
CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category story_category,
  tags TEXT[] DEFAULT '{}',
  target_audience target_audience DEFAULT 'adult_25_plus',
  language story_language DEFAULT 'english',
  is_mature BOOLEAN DEFAULT FALSE,
  status story_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Chapter',
  content TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Stories policies
CREATE POLICY "Users can view their own stories" ON public.stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" ON public.stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON public.stories
  FOR DELETE USING (auth.uid() = user_id);

-- Chapters policies
CREATE POLICY "Users can view chapters of their stories" ON public.chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chapters for their stories" ON public.chapters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update chapters of their stories" ON public.chapters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete chapters of their stories" ON public.chapters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_stories_status ON public.stories(status);
CREATE INDEX idx_chapters_story_id ON public.chapters(story_id);
CREATE INDEX idx_chapters_order ON public.chapters(story_id, order_index);
