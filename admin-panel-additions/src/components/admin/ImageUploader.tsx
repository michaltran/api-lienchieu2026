import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useUploadImage } from "../../hooks/useUpload";

interface ImageUploaderProps {
  value?: string | null;
  onChange?: (url: string | null, publicId?: string | null) => void;
  onUploaded?: (data: { url: string; publicId: string; id: string }) => void;
  className?: string;
  placeholder?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
}

const aspectClass = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
  auto: "",
};

export default function ImageUploader({
  value,
  onChange,
  onUploaded,
  className = "",
  placeholder = "Kéo thả hoặc click để tải ảnh lên",
  aspectRatio = "video",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const upload = useUploadImage();

  const handleFile = async (file: File) => {
    try {
      const result: any = await upload.mutateAsync(file);
      onChange?.(result.url, result.publicId || result.id);
      onUploaded?.(result);
    } catch (err) {
      console.error(err);
      alert("Tải ảnh thất bại!");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className={`relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 ${aspectClass[aspectRatio]}`}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 rounded-md text-sm font-medium hover:bg-slate-100"
            >
              <Upload className="w-4 h-4 inline mr-1" /> Đổi ảnh
            </button>
            <button
              type="button"
              onClick={() => onChange?.(null, null)}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          disabled={upload.isPending}
          className={`w-full ${aspectClass[aspectRatio]} border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-slate-400"
          } ${upload.isPending ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
        >
          {upload.isPending ? (
            <>
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="text-sm text-slate-600">Đang tải lên...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-slate-400" />
              <span className="text-sm text-slate-600">{placeholder}</span>
              <span className="text-xs text-slate-400">PNG, JPG, WEBP tối đa 10MB</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
