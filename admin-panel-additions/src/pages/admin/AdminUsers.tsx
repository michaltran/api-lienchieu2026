import { useState } from "react";
import { useUsers, useSaveUser, useDeleteUser } from "../../hooks/useAdminResources";
import type { AdminUser, UserRole } from "../../lib/api/users";
import DataTable from "../../components/admin/DataTable";
import { Plus, Edit, Trash2, X, Save, Search, Shield } from "lucide-react";

const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: "super_admin", label: "Super Admin", color: "bg-red-100 text-red-700" },
  { value: "admin", label: "Admin", color: "bg-orange-100 text-orange-700" },
  { value: "editor", label: "Editor", color: "bg-blue-100 text-blue-700" },
  { value: "author", label: "Tác giả", color: "bg-green-100 text-green-700" },
  { value: "viewer", label: "Người xem", color: "bg-slate-100 text-slate-700" },
];

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"" | UserRole>("");
  const [editing, setEditing] = useState<Partial<AdminUser> & { password?: string } | null>(null);

  const { data, isLoading } = useUsers({ page, limit: 20, search, role: role || undefined });
  const save = useSaveUser();
  const remove = useDeleteUser();

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.id && !editing.password) return alert("Nhập mật khẩu cho tài khoản mới");
    await save.mutateAsync(editing);
    setEditing(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Người dùng</h1>
          <p className="text-slate-500">Tạo tài khoản và phân quyền</p>
        </div>
        <button
          onClick={() => setEditing({ role: "editor", status: "active" })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm tài khoản
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, username..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value as any)} className="px-3 py-2 border rounded-lg">
          <option value="">Tất cả vai trò</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      <DataTable
        loading={isLoading}
        data={data?.items || []}
        columns={[
          {
            key: "name", header: "Người dùng",
            render: (u) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {(u.name || u.username)[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{u.name || u.username}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </div>
              </div>
            ),
          },
          {
            key: "role", header: "Vai trò",
            render: (u) => {
              const r = ROLES.find(x => x.value === u.role);
              return <span className={`px-2 py-0.5 rounded text-xs font-medium ${r?.color || ""}`}>{r?.label || u.role}</span>;
            },
          },
          {
            key: "status", header: "Trạng thái",
            render: (u) => (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                u.status === "active" ? "bg-green-100 text-green-700" :
                u.status === "locked" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
              }`}>
                {u.status === "active" ? "Hoạt động" : u.status === "locked" ? "Đã khoá" : "Tạm ngưng"}
              </span>
            ),
          },
          {
            key: "lastLogin", header: "Đăng nhập gần nhất",
            render: (u) => u.lastLogin ? new Date(u.lastLogin).toLocaleString("vi-VN") : "—",
          },
          {
            key: "actions", header: "", width: "120px",
            render: (u) => (
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(u)} className="p-1.5 hover:bg-slate-100 rounded text-blue-600">
                  <Edit className="w-4 h-4" />
                </button>
                {u.role !== "super_admin" && (
                  <button
                    onClick={async () => {
                      if (confirm("Xoá tài khoản này?")) await remove.mutateAsync(u.id);
                    }}
                    className="p-1.5 hover:bg-slate-100 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />

      {editing && (
        <UserModal
          user={editing}
          onChange={(p) => setEditing({ ...editing, ...p })}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          saving={save.isPending}
        />
      )}
    </div>
  );
}

function UserModal({ user, onChange, onClose, onSave, saving }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">{user.id ? "Sửa tài khoản" : "Tạo tài khoản mới"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
              <input value={user.name || ""} onChange={(e) => onChange({ name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <input value={user.username || ""} onChange={(e) => onChange({ username: e.target.value })} className="w-full px-3 py-2 border rounded-lg" disabled={!!user.id} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input type="email" value={user.email || ""} onChange={(e) => onChange({ email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {user.id ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
            </label>
            <input type="password" value={user.password || ""} onChange={(e) => onChange({ password: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <select value={user.role || "editor"} onChange={(e) => onChange({ role: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select value={user.status || "active"} onChange={(e) => onChange({ status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
                <option value="locked">Khoá</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Điện thoại</label>
            <input value={user.phone || ""} onChange={(e) => onChange({ phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-900 flex gap-2">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <b>super_admin</b>: toàn quyền<br />
              <b>admin</b>: quản lý mọi thứ trừ super admin<br />
              <b>editor</b>: sửa nội dung (bài viết, trang, menu, media)<br />
              <b>author</b>: chỉ bài viết của mình<br />
              <b>viewer</b>: chỉ xem
            </div>
          </div>
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
