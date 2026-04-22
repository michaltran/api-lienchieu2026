import { useState } from "react";
import { useMenuTree, useSaveMenu, useDeleteMenu } from "../../hooks/useAdminResources";
import type { MenuItem, MenuPosition } from "../../lib/api/menus";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, X, Save } from "lucide-react";
import LoadingLogo from "../../components/ui/LoadingLogo";

const POSITIONS: { value: MenuPosition; label: string }[] = [
  { value: "header", label: "Menu Header" },
  { value: "footer", label: "Menu Footer" },
  { value: "sidebar", label: "Menu Sidebar" },
];

export default function AdminMenus() {
  const [position, setPosition] = useState<MenuPosition>("header");
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data: tree, isLoading } = useMenuTree(position);
  const saveMenu = useSaveMenu();
  const deleteMenu = useDeleteMenu();

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá menu này? Các menu con cũng sẽ bị xoá.")) return;
    await deleteMenu.mutateAsync(id);
  };

  const handleSave = async () => {
    if (!editing?.name?.trim()) return alert("Nhập tên menu");
    await saveMenu.mutateAsync({ ...editing, position });
    setEditing(null);
  };

  const renderItem = (item: MenuItem, level = 0) => (
    <div key={item.id}>
      <div
        className="flex items-center gap-2 p-3 border-b border-slate-100 hover:bg-slate-50"
        style={{ paddingLeft: 12 + level * 24 }}
      >
        {item.children?.length ? (
          <button onClick={() => toggle(item.id)} className="p-0.5 hover:bg-slate-200 rounded">
            {expanded[item.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.name}</span>
            {!item.isActive && <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-600 rounded">Ẩn</span>}
            <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">{item.type}</span>
          </div>
          <div className="text-xs text-slate-500 truncate">{item.url || "—"}</div>
        </div>
        <button
          onClick={() => setEditing({ ...item, parentId: null })}
          className="p-1.5 hover:bg-slate-200 rounded text-emerald-600"
          title="Thêm menu con"
        >
          <Plus className="w-4 h-4" onClick={(e) => { e.stopPropagation(); setEditing({ parentId: item.id, position }); }} />
        </button>
        <button
          onClick={() => setEditing(item)}
          className="p-1.5 hover:bg-slate-200 rounded text-blue-600"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(item.id)}
          className="p-1.5 hover:bg-slate-200 rounded text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {expanded[item.id] && item.children?.map((c) => renderItem(c, level + 1))}
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Menu</h1>
          <p className="text-slate-500">Cấu hình menu hiển thị trên website</p>
        </div>
        <button
          onClick={() => setEditing({ position, parentId: null, type: "page" })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm menu
        </button>
      </div>

      <div className="flex gap-2">
        {POSITIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPosition(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              position === p.value ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><LoadingLogo /></div>
        ) : tree?.length ? (
          <div>{tree.map((item) => renderItem(item))}</div>
        ) : (
          <div className="p-12 text-center text-slate-500">Chưa có menu nào ở vị trí này</div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <MenuFormModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onChange={(patch) => setEditing({ ...editing, ...patch })}
          saving={saveMenu.isPending}
          parentOptions={tree || []}
        />
      )}
    </div>
  );
}

function MenuFormModal({
  item, onClose, onSave, onChange, saving, parentOptions,
}: {
  item: Partial<MenuItem>;
  onClose: () => void;
  onSave: () => void;
  onChange: (patch: Partial<MenuItem>) => void;
  saving: boolean;
  parentOptions: MenuItem[];
}) {
  // Flatten tree for parent dropdown
  const flat: { id: string; name: string; level: number }[] = [];
  const walk = (items: MenuItem[], level = 0) => {
    items.forEach((i) => {
      if (i.id !== item.id) {
        flat.push({ id: i.id, name: i.name, level });
        if (i.children) walk(i.children, level + 1);
      }
    });
  };
  walk(parentOptions);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">{item.id ? "Sửa menu" : "Thêm menu mới"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Tên menu *">
            <input
              value={item.name || ""}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: Giới thiệu"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Loại">
              <select
                value={item.type || "page"}
                onChange={(e) => onChange({ type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="page">Trang tĩnh</option>
                <option value="category">Chuyên mục bài viết</option>
                <option value="external">Link ngoài</option>
                <option value="custom">Tuỳ chỉnh</option>
              </select>
            </Field>
            <Field label="Menu cha">
              <select
                value={String(item.parentId || "")}
                onChange={(e) => onChange({ parentId: e.target.value ? (e.target.value as any) : null })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">— Không có (menu gốc) —</option>
                {flat.map((p) => (
                  <option key={p.id} value={p.id}>
                    {"— ".repeat(p.level)}{p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="URL / Đường dẫn">
            <input
              value={item.url || ""}
              onChange={(e) => onChange({ url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="/gioi-thieu hoặc https://..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Icon (Lucide)">
              <input
                value={item.icon || ""}
                onChange={(e) => onChange({ icon: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="VD: Home"
              />
            </Field>
            <Field label="Thứ tự hiển thị">
              <input
                type="number"
                value={item.orderIndex ?? 0}
                onChange={(e) => onChange({ orderIndex: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </Field>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.openNewTab || false}
                onChange={(e) => onChange({ openNewTab: e.target.checked })}
              />
              <span className="text-sm">Mở tab mới</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.isActive !== false}
                onChange={(e) => onChange({ isActive: e.target.checked })}
              />
              <span className="text-sm">Hiển thị</span>
            </label>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-2 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-slate-100">Huỷ</button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />{saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
