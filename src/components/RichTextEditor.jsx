import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated without re-triggering Quill initialization
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing children before attaching (safe for React 19 StrictMode)
    container.innerHTML = '';

    const editorDiv = document.createElement('div');
    container.appendChild(editorDiv);

    const quill = new Quill(editorDiv, {
      theme: 'snow',
      placeholder: placeholder || 'Begin writing your story here... format paragraphs, headers, blockquotes, and lists.',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link'],
          ['clean'],
        ],
      },
    });

    quillRef.current = quill;

    if (value) {
      quill.root.innerHTML = value;
    }

    quill.on('text-change', () => {
      isUpdatingRef.current = true;
      const html = quill.root.innerHTML;
      if (onChangeRef.current) {
        onChangeRef.current(html === '<p><br></p>' ? '' : html);
      }
      isUpdatingRef.current = false;
    });

    return () => {
      quillRef.current = null;
      container.innerHTML = '';
    };
    // Initialize once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value updates
  useEffect(() => {
    if (quillRef.current && !isUpdatingRef.current) {
      if ((value || '') !== quillRef.current.root.innerHTML) {
        quillRef.current.root.innerHTML = value || '';
      }
    }
  }, [value]);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-stone-200">
      <div ref={containerRef} />
    </div>
  );
};

export default RichTextEditor;
