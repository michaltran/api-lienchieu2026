import { useRef, useState } from "react";
import { useMediaList, useBulkDeleteMedia, useAlbums } from "../../hooks/useAdminResources";
import { http } from "../../lib/api/http";
import { Upload, Trash2, Film, Image as ImageIcon, Filter, Loader2, Search } from "lucide-react";
import LoadingLogo from "../../components/ui/LoadingLogo";

export default function AdminMediaLibrary() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | "image" | "video">("");
  const [albumId, setAlbumId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useMediaList({ page, limit: 30, search, type: type || undefined, albumId: albumId || undefined });
  const { data: albums } = useAlbums({ limit: 100 });
  const bulkDelete = useBulkDeleteMedia();

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      if (albumId) formData.append("albumId", albumId);
      await http.post("/api/uploads/multiple", formData, { headers: { "Content-Type": "multipart/form-data" } });
      // invalidate sẽ auto refresh
      window.location.reload();
    } catch {
      alert("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!confirm(`Xoá ${selected.length} file?`)) return;
    await bulkDelete.mutateAsync(selected);
    setSelected([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Thư viện Media</h1>
          <p className="text-slate-500">Quản lý ảnh và video</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Tải lên
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="px-3 py-2 border rounded-lg">
          <option value="">Tất cả loại</option>
          <option value="image">Ảnh</option>
          <option value="video">Video</option>
        </select>
        <select value={albumId} onChange={(e) => setAlbumId(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">Tất cả album</option>
          <option value="null">Chưa phân loại</option>
          {(albums?.items || []).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {selected.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Xoá {selected.length} file
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center"><LoadingLogo /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(data?.items || []).map((m) => {
              const isSel = selected.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => setSelected(isSel ? selected.filter(s => s !== m.id) : [...selected, m.id])}
                  className={`relative group aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer ${isSel ? "ring-2 ring-blue-500" : ""}`}
                >
                  {m.type === "video" ? (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                      <Film className="w-10 h-10" />
                    </div>
                  ) : (
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-1 left-1">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => {}}
                      className="rounded"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="truncate">{m.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {data?.items.length === 0 && (
            <div className="text-center text-slate-500 py-12 bg-white rounded-xl border">Thư viện đang trống</div>
          )}
          {data && data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Trước</button>
      <span className="text-sm">Trang {page} / {totalPages}</span>
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Sau</button>
    </div>
  );
}
