'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type RichTextEditorProps = {
  name: string;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
};

function insertHtmlAtCursor(html: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const template = document.createElement('template');
  template.innerHTML = html;
  const fragment = template.content;
  const lastNode = fragment.lastChild;

  range.insertNode(fragment);

  if (lastNode) {
    const nextRange = document.createRange();
    nextRange.setStartAfter(lastNode);
    nextRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(nextRange);
  }
}

function insertTextAtCursor(text: string): void {
  const safeText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  insertHtmlAtCursor(safeText.replace(/\n/g, '<br />'));
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Unable to read pasted image.'));
    reader.readAsDataURL(file);
  });
}

export default function RichTextEditor({ name, defaultValue, placeholder, required }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [html, setHtml] = useState(defaultValue);

  useEffect(() => {
    setHtml(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    if (editor.innerHTML !== html) {
      editor.innerHTML = html;
    }
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = html;
    }
  }, [html]);

  const placeholderClass = useMemo(
    () => (html ? '' : 'before:content-[attr(data-placeholder)] before:absolute before:left-4 before:top-4 before:text-slate-400 before:pointer-events-none'),
    [html]
  );

  const applyCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setHtml(editorRef.current?.innerHTML || '');
  };

  const handleInput = () => {
    setHtml(editorRef.current?.innerHTML || '');
  };

  const insertImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    insertHtmlAtCursor(`<img src="${dataUrl}" alt="Inserted image" style="max-width:100%;height:auto;display:block;margin:1rem 0;" />`);
    setHtml(editorRef.current?.innerHTML || '');
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboard = event.clipboardData;
    const htmlData = clipboard.getData('text/html');
    const textData = clipboard.getData('text/plain');
    const files = Array.from(clipboard.files || []);

    if (files.some((file) => file.type.startsWith('image/'))) {
      event.preventDefault();
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        insertHtmlAtCursor(`<img src="${dataUrl}" alt="Pasted image" style="max-width:100%;height:auto;display:block;margin:1rem 0;" />`);
      }

      setHtml(editorRef.current?.innerHTML || '');
      return;
    }

    if (htmlData) {
      event.preventDefault();
      insertHtmlAtCursor(htmlData);
      setHtml(editorRef.current?.innerHTML || '');
      return;
    }

    if (textData) {
      event.preventDefault();
      insertTextAtCursor(textData);
      setHtml(editorRef.current?.innerHTML || '');
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(event.dataTransfer.files || []);
    if (!files.some((file) => file.type.startsWith('image/'))) {
      return;
    }

    event.preventDefault();
    editorRef.current?.focus();

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const dataUrl = await readFileAsDataUrl(file);
      insertHtmlAtCursor(`<img src="${dataUrl}" alt="Dropped image" style="max-width:100%;height:auto;display:block;margin:1rem 0;" />`);
    }

    setHtml(editorRef.current?.innerHTML || '');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-lg border border-outline-variant/30 bg-white p-3">
        <button type="button" onClick={() => applyCommand('bold')} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-50">
          Bold
        </button>
        <button type="button" onClick={() => applyCommand('italic')} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-50">
          Italic
        </button>
        <button type="button" onClick={() => applyCommand('insertUnorderedList')} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-50">
          Bullets
        </button>
        <button type="button" onClick={() => applyCommand('insertOrderedList')} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-50">
          Numbered
        </button>
        <button type="button" onClick={() => applyCommand('formatBlock', 'h2')} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-50">
          H2
        </button>
        <button type="button" onClick={() => applyCommand('createLink', window.prompt('Enter link URL') || '')} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-50">
          Link
        </button>
        <button type="button" onClick={() => imageInputRef.current?.click()} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-50">
          Image
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={`relative min-h-[320px] rounded-lg border border-outline-variant/30 bg-white px-4 py-4 outline-none focus:border-primary prose prose-slate max-w-none prose-img:my-4 prose-img:max-w-full ${placeholderClass}`}
        onInput={handleInput}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      />

      <input ref={hiddenInputRef} type="hidden" name={name} value={html} required={required} />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          editorRef.current?.focus();
          await insertImageFile(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}