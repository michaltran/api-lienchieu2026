import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Quote, Undo, Redo,
} from "lucide-react";
import { useUploadImage } from "../../hooks/useUpload";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

// Simple rich text editor dùng document.execCommand
// (vẫn được hỗ trợ rộng rãi, đủ dùng cho nội dung bài viết)
export default function RichTextEditor({ value, onChange, placeholder = "Nhập nội dung...", minHeight = 400 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const upload = useUploadImage();

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  };

  const handleLink = () => {
    const url = prompt("Nhập URL:");
    if (url) exec("createLink", url);
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const res: any = await upload.mutateAsync(file);
        exec("insertImage", res.url);
      } catch {
        alert("Upload ảnh thất bại");
      }
    };
    input.click();
  };

  const btn = "p-2 rounded hover:bg-slate-200 text-slate-700 transition-colors";

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${isFocused ? "ring-2 ring-blue-500" : ""}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <button type="button" className={btn} onClick={() => exec("bold")} title="In đậm"><Bold className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("italic")} title="In nghiêng"><Italic className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("underline")} title="Gạch chân"><Underline className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <button type="button" className={btn} onClick={() => exec("formatBlock", "h1")} title="Tiêu đề 1"><Heading1 className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("formatBlock", "h2")} title="Tiêu đề 2"><Heading2 className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("formatBlock", "h3")} title="Tiêu đề 3"><Heading3 className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("formatBlock", "blockquote")} title="Trích dẫn"><Quote className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <button type="button" className={btn} onClick={() => exec("insertUnorderedList")} title="Danh sách"><List className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("insertOrderedList")} title="Số thứ tự"><ListOrdered className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <button type="button" className={btn} onClick={() => exec("justifyLeft")} title="Căn trái"><AlignLeft className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("justifyCenter")} title="Căn giữa"><AlignCenter className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("justifyRight")} title="Căn phải"><AlignRight className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <button type="button" className={btn} onClick={handleLink} title="Chèn link"><LinkIcon className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={handleImageUpload} title="Chèn ảnh"><ImageIcon className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <button type="button" className={btn} onClick={() => exec("undo")} title="Hoàn tác"><Undo className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("redo")} title="Làm lại"><Redo className="w-4 h-4" /></button>
      </div>

      <div
        ref={ref}
        contentEditable
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="prose max-w-none p-4 focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
        }
        [contenteditable] h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0; }
        [contenteditable] h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0; }
        [contenteditable] h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0; }
        [contenteditable] blockquote { border-left: 4px solid #0284c7; padding-left: 1rem; color: #475569; margin: 1rem 0; font-style: italic; }
        [contenteditable] ul { list-style: disc; padding-left: 2rem; }
        [contenteditable] ol { list-style: decimal; padding-left: 2rem; }
        [contenteditable] a { color: #0284c7; text-decoration: underline; }
        [contenteditable] img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
      `}</style>
    </div>
  );
}
