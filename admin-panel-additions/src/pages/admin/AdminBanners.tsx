import { useState } from "react";
import { useBanners, useSaveBanner, useDeleteBanner } from "../../hooks/useAdminResources";
import type { Banner, BannerPosition } from "../../lib/api/banners";
import ImageUploader from "../../components/admin/ImageUploader";
import { Plus, Edit, Trash2, X, Save, ArrowUp, ArrowDown } from "lucide-react";
import LoadingLogo from "../../components/ui/LoadingLogo";

const POSITIONS: { value: BannerPosition; label: string }[] = [
  { value: "homepage_hero", label: "Slide chính trang chủ" },
  { value: "homepage_middle", label: "Giữa trang chủ" },
  { value: "sidebar", label: "Sidebar" },
  { value: "popup", label: "Popup" },
];

export default function AdminBanners() {
  const [position, setPosition] = useState<BannerPosition>("homepage_hero");
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);

  const { data, isLoading } = useBanners({ position, limit: 100 });
  const save = useSaveBanner();
  const remove = useDeleteBanner();

  const handleSave = async () => {
    if (!editing?.image) return alert("Chọn ảnh banner");
    await save.mutateAsync({ ...editing, position });
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá banner này?")) return;
    await remove.mutateAsync(id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Banner / Slide</h1>
          <p className="text-slate-500">Quản lý các banner hiển thị trên website</p>
        </div>
        <button
          onClick={() => setEditing({ position, isActive: true })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm banner
        </button>
      </div>

      <div className="flex gap-2">
        {POSITIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPosition(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              position === p.value ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center"><LoadingLogo /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.items || []).map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="aspect-video bg-slate-100 relative">
                <img src={b.image} alt="" className="w-full h-full object-cover" />
                {!b.isActive && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-800/80 text-white text-xs rounded">Ẩn</div>
                )}
              </div>
              <div className="p-4">
                <div className="font-semibold text-slate-800 truncate">{b.title || "Không có tiêu đề"}</div>
                {b.subtitle && <div className="text-sm text-slate-500 truncate">{b.subtitle}</div>}
                <div className="text-xs text-slate-400 mt-1">Thứ tự: {b.orderIndex}</div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setEditing(b)}
                    className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm font-medium hover:bg-blue-100"
                  >
                    <Edit className="w-3.5 h-3.5 inline mr-1" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded text-sm hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data?.items.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-12 bg-white rounded-xl border">
              Chưa có banner nào ở vị trí này
            </div>
          )}
        </div>
      )}

      {editing && (
        <BannerModal
          item={editing}
          onClose={() => setEditing(null)}
          onChange={(p) => setEditing({ ...editing, ...p })}
          onSave={handleSave}
          saving={save.isPending}
        />
      )}
    </div>
  );
}

function BannerModal({ item, onClose, onChange, onSave, saving }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">{item.id ? "Sửa banner" : "Thêm banner mới"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ảnh banner *</label>
            <ImageUploader
              value={item.image}
              onChange={(url, publicId) => onChange({ image: url, imagePublicId: publicId })}
              aspectRatio="wide"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ảnh mobile (tuỳ chọn)</label>
            <ImageUploader
              value={item.mobileImage}
              onChange={(url, publicId) => onChange({ mobileImage: url, mobileImagePublicId: publicId })}
              aspectRatio="square"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <input value={item.title || ""} onChange={(e) => onChange({ title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phụ đề</label>
              <input value={item.subtitle || ""} onChange={(e) => onChange({ subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea value={item.description || ""} onChange={(e) => onChange({ description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Link khi click</label>
              <input value={item.link || ""} onChange={(e) => onChange({ link: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="/dang-ky-kham" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text nút (CTA)</label>
              <input value={item.buttonText || ""} onChange={(e) => onChange({ buttonText: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Xem ngay" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự</label>
              <input type="number" value={item.orderIndex ?? 0} onChange={(e) => onChange({ orderIndex: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
              <input type="date" value={item.startDate?.slice(0, 10) || ""} onChange={(e) => onChange({ startDate: e.target.value || null })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
              <input type="date" value={item.endDate?.slice(0, 10) || ""} onChange={(e) => onChange({ endDate: e.target.value || null })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={item.isActive !== false} onChange={(e) => onChange({ isActive: e.target.checked })} />
            <span className="text-sm">Hiển thị banner</span>
          </label>
        </div>
        <div className="p-5 border-t flex justify-end gap-2 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-slate-100">Huỷ</button>
          <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            <Save className="w-4 h-4 inline mr-1" />{saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
