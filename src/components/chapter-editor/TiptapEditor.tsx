import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import { useEffect } from 'react';
import { TiptapToolbar } from './TiptapToolbar';
import { getWordCountFromHTML } from '@/utils/wordCount';
import './tiptap-editor.css';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
}

export const TiptapEditor = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your chapter...",
  className = "",
  showToolbar = true
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
      Typography,
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sage max-w-none focus:outline-none ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // Use the unified word counting method for consistency with reading mode
  const wordCount = getWordCountFromHTML(editor.getHTML());

  return (
    <div className="w-full">
      {showToolbar && <TiptapToolbar editor={editor} />}
      <div className="relative">
        <EditorContent editor={editor} />
        <div className="absolute bottom-2 right-2 text-xs text-sage-500 pointer-events-none">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </div>
      </div>
    </div>
  );
};