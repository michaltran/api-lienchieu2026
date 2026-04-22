import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useCategories, useSaveCategory, useDeleteCategory,
  usePages, useSavePage, useDeletePage,
  useDepartments, useSaveDepartment, useDeleteDepartment,
  useDoctors, useSaveDoctor, useDeleteDoctor,
  useServices, useSaveService, useDeleteService,
  useDrugs, useSaveDrug, useDeleteDrug,
  useMessages, useReplyMessage, useDeleteMessage,
  useActivityLogs,
} from "../../hooks/useAdminResources";
import DataTable from "../../components/admin/DataTable";
import ImageUploader from "../../components/admin/ImageUploader";
import RichTextEditor from "../../components/admin/RichTextEditor";
import { Plus, Edit, Trash2, X, Save, Search, Eye, MessageSquare } from "lucide-react";

// ==================== CATEGORIES ====================
export function AdminCategories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const { data, isLoading } = useCategories({ page, limit: 20, search });
  const save = useSaveCategory();
  const remove = useDeleteCategory();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <Header title="Chuyên mục bài viết" onAdd={() => setEditing({ isActive: true, orderIndex: 0 })} />
      <SearchBar value={search} onChange={setSearch} />
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          { key: "name", header: "Tên chuyên mục", render: (c: any) => <span className="font-medium">{c.name}</span> },
          { key: "slug", header: "Slug", render: (c: any) => <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{c.slug}</code> },
          { key: "orderIndex", header: "Thứ tự" },
          { key: "isActive", header: "Trạng thái", render: (c: any) => <Badge active={c.isActive} /> },
          {
            key: "actions", header: "", width: "100px",
            render: (c: any) => <RowActions onEdit={() => setEditing(c)} onDelete={async () => { if (confirm("Xoá?")) await remove.mutateAsync(c.id); }} />,
          },
        ]}
      />
      {editing && (
        <SimpleModal title={editing.id ? "Sửa chuyên mục" : "Thêm chuyên mục"} onClose={() => setEditing(null)} onSave={async () => { await save.mutateAsync(editing); setEditing(null); }} saving={save.isPending}>
          <Field label="Tên *"><input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Mô tả"><textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} /></Field>
          <Field label="Ảnh đại diện"><ImageUploader value={editing.thumbnail} onChange={(url, pid) => setEditing({ ...editing, thumbnail: url, thumbnailPublicId: pid })} aspectRatio="video" /></Field>
          <Field label="Thứ tự"><input type="number" value={editing.orderIndex || 0} onChange={(e) => setEditing({ ...editing, orderIndex: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <label className="flex items-center gap-2"><input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Hiển thị</label>
        </SimpleModal>
      )}
    </div>
  );
}

// ==================== PAGES ====================
export function AdminPages() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const { data, isLoading } = usePages({ page, limit: 20, search });
  const save = useSavePage();
  const remove = useDeletePage();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <Header title="Trang tĩnh" onAdd={() => setEditing({ template: "default", status: "published" })} />
      <SearchBar value={search} onChange={setSearch} />
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          { key: "title", header: "Tiêu đề", render: (p: any) => <span className="font-medium">{p.title}</span> },
          { key: "slug", header: "Slug", render: (p: any) => <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">/{p.slug}</code> },
          { key: "template", header: "Template" },
          { key: "status", header: "Trạng thái", render: (p: any) => <Badge active={p.status === "published"} labelOn="Đã đăng" labelOff="Nháp" /> },
          {
            key: "actions", header: "", width: "100px",
            render: (p: any) => <RowActions onEdit={() => setEditing(p)} onDelete={async () => { if (confirm("Xoá?")) await remove.mutateAsync(p.id); }} />,
          },
        ]}
      />
      {editing && (
        <SimpleModal size="xl" title={editing.id ? "Sửa trang" : "Thêm trang"} onClose={() => setEditing(null)} onSave={async () => { await save.mutateAsync(editing); setEditing(null); }} saving={save.isPending}>
          <Field label="Tiêu đề *"><input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Ảnh đại diện"><ImageUploader value={editing.thumbnail} onChange={(url, pid) => setEditing({ ...editing, thumbnail: url, thumbnailPublicId: pid })} aspectRatio="video" /></Field>
          <Field label="Nội dung"><RichTextEditor value={editing.content || ""} onChange={(html) => setEditing({ ...editing, content: html })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Template">
              <select value={editing.template || "default"} onChange={(e) => setEditing({ ...editing, template: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="default">Mặc định</option>
                <option value="about">Giới thiệu</option>
                <option value="contact">Liên hệ</option>
                <option value="gallery">Thư viện</option>
              </select>
            </Field>
            <Field label="Trạng thái">
              <select value={editing.status || "published"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="published">Đã đăng</option>
                <option value="draft">Nháp</option>
              </select>
            </Field>
          </div>
        </SimpleModal>
      )}
    </div>
  );
}

// ==================== DEPARTMENTS ====================
export function AdminDepartments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [block, setBlock] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const { data, isLoading } = useDepartments({ page, limit: 20, search, block: block || undefined });
  const save = useSaveDepartment();
  const remove = useDeleteDepartment();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <Header title="Khoa phòng" onAdd={() => setEditing({ block: "lam-sang", isActive: true, duties: [], leaders: [], info: {} })} />
      <div className="bg-white rounded-xl border p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-lg" placeholder="Tìm kiếm..." />
        </div>
        <select value={block} onChange={(e) => setBlock(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">Tất cả khối</option>
          <option value="lam-sang">Lâm sàng</option>
          <option value="can-lam-sang">Cận lâm sàng</option>
          <option value="hanh-chinh">Hành chính</option>
        </select>
      </div>
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          {
            key: "name", header: "Tên khoa",
            render: (d: any) => (
              <div className="flex items-center gap-3">
                {d.teamImage && <img src={d.teamImage} alt="" className="w-10 h-10 rounded object-cover" />}
                <span className="font-medium">{d.name}</span>
              </div>
            ),
          },
          {
            key: "block", header: "Khối",
            render: (d: any) => ({
              "lam-sang": "Lâm sàng", "can-lam-sang": "Cận lâm sàng", "hanh-chinh": "Hành chính",
            }[d.block] || d.block),
          },
          { key: "isActive", header: "Trạng thái", render: (d: any) => <Badge active={d.isActive} /> },
          {
            key: "actions", header: "", width: "100px",
            render: (d: any) => <RowActions onEdit={() => setEditing(d)} onDelete={async () => { if (confirm("Xoá?")) await remove.mutateAsync(d.id); }} />,
          },
        ]}
      />
      {editing && (
        <SimpleModal size="lg" title={editing.id ? "Sửa khoa phòng" : "Thêm khoa phòng"} onClose={() => setEditing(null)} onSave={async () => { await save.mutateAsync(editing); setEditing(null); }} saving={save.isPending}>
          <Field label="Tên khoa *"><input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Khối">
              <select value={editing.block} onChange={(e) => setEditing({ ...editing, block: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="lam-sang">Lâm sàng</option>
                <option value="can-lam-sang">Cận lâm sàng</option>
                <option value="hanh-chinh">Hành chính</option>
              </select>
            </Field>
            <Field label="Thứ tự"><input type="number" value={editing.orderIndex || 0} onChange={(e) => setEditing({ ...editing, orderIndex: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          </div>
          <Field label="Ảnh tập thể"><ImageUploader value={editing.teamImage} onChange={(url, pid) => setEditing({ ...editing, teamImage: url, teamImagePublicId: pid })} aspectRatio="video" /></Field>
          <Field label="Sứ mệnh"><textarea value={editing.missionText || ""} onChange={(e) => setEditing({ ...editing, missionText: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} /></Field>
          <Field label="Nhiệm vụ (mỗi dòng 1 mục)">
            <textarea
              value={(editing.duties || []).join("\n")}
              onChange={(e) => setEditing({ ...editing, duties: e.target.value.split("\n").filter(Boolean) })}
              rows={4} className="w-full px-3 py-2 border rounded-lg"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Điện thoại"><input value={editing.info?.phone || ""} onChange={(e) => setEditing({ ...editing, info: { ...editing.info, phone: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            <Field label="Email"><input value={editing.info?.email || ""} onChange={(e) => setEditing({ ...editing, info: { ...editing.info, email: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          </div>
          <Field label="Vị trí"><input value={editing.info?.location || ""} onChange={(e) => setEditing({ ...editing, info: { ...editing.info, location: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Giờ làm việc"><input value={editing.info?.workingHours || ""} onChange={(e) => setEditing({ ...editing, info: { ...editing.info, workingHours: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <label className="flex items-center gap-2"><input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Hiển thị</label>
        </SimpleModal>
      )}
    </div>
  );
}

// ==================== DOCTORS ====================
export function AdminDoctors() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const { data, isLoading } = useDoctors({ page, limit: 20, search });
  const save = useSaveDoctor();
  const remove = useDeleteDoctor();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <Header title="Chuyên gia Y tế" onAdd={() => setEditing({ isActive: true, featured: false, experienceYears: 0 })} />
      <SearchBar value={search} onChange={setSearch} />
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          {
            key: "name", header: "Họ tên",
            render: (d: any) => (
              <div className="flex items-center gap-3">
                {d.avatar && <img src={d.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />}
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.title}</div>
                </div>
              </div>
            ),
          },
          { key: "specialty", header: "Chuyên khoa" },
          { key: "experienceYears", header: "Kinh nghiệm", render: (d: any) => `${d.experienceYears} năm` },
          { key: "featured", header: "Nổi bật", render: (d: any) => d.featured ? "⭐" : "" },
          {
            key: "actions", header: "", width: "100px",
            render: (d: any) => <RowActions onEdit={() => setEditing(d)} onDelete={async () => { if (confirm("Xoá?")) await remove.mutateAsync(d.id); }} />,
          },
        ]}
      />
      {editing && (
        <SimpleModal size="lg" title={editing.id ? "Sửa bác sĩ" : "Thêm bác sĩ"} onClose={() => setEditing(null)} onSave={async () => { await save.mutateAsync(editing); setEditing(null); }} saving={save.isPending}>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <Field label="Ảnh"><ImageUploader value={editing.avatar} onChange={(url, pid) => setEditing({ ...editing, avatar: url, avatarPublicId: pid })} aspectRatio="square" /></Field>
            <div className="space-y-4">
              <Field label="Họ tên *"><input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
              <Field label="Chức danh"><input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="BS. CKII, ThS. BS..." /></Field>
              <Field label="Chuyên khoa"><input value={editing.specialty || ""} onChange={(e) => setEditing({ ...editing, specialty: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Số năm kinh nghiệm"><input type="number" value={editing.experienceYears || 0} onChange={(e) => setEditing({ ...editing, experienceYears: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            <Field label="Ngôn ngữ (phẩy)">
              <input
                value={(editing.languages || []).join(", ")}
                onChange={(e) => setEditing({ ...editing, languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                className="w-full px-3 py-2 border rounded-lg" placeholder="Tiếng Việt, Tiếng Anh"
              />
            </Field>
          </div>
          <Field label="Tiểu sử"><textarea value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Lịch làm việc"><input value={editing.scheduleNote || ""} onChange={(e) => setEditing({ ...editing, scheduleNote: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Nổi bật</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Hiển thị</label>
          </div>
        </SimpleModal>
      )}
    </div>
  );
}

// ==================== SERVICES ====================
export function AdminServices() {
  const [editing, setEditing] = useState<any>(null);
  const { data, isLoading } = useServices({ limit: 100 });
  const save = useSaveService();
  const remove = useDeleteService();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <Header title="Dịch vụ" onAdd={() => setEditing({ isActive: true })} />
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          { key: "title", header: "Dịch vụ", render: (s: any) => <span className="font-medium">{s.title}</span> },
          { key: "icon", header: "Icon", render: (s: any) => <code className="text-xs">{s.icon}</code> },
          { key: "category", header: "Danh mục" },
          { key: "isActive", header: "Trạng thái", render: (s: any) => <Badge active={s.isActive} /> },
          { key: "actions", header: "", width: "100px", render: (s: any) => <RowActions onEdit={() => setEditing(s)} onDelete={async () => { if (confirm("Xoá?")) await remove.mutateAsync(s.id); }} /> },
        ]}
      />
      {editing && (
        <SimpleModal title={editing.id ? "Sửa dịch vụ" : "Thêm dịch vụ"} onClose={() => setEditing(null)} onSave={async () => { await save.mutateAsync(editing); setEditing(null); }} saving={save.isPending}>
          <Field label="Tiêu đề *"><input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Mô tả"><textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Icon (Lucide)"><input value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Stethoscope, Heart..." /></Field>
            <Field label="Danh mục"><input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          </div>
          <Field label="Ảnh minh hoạ"><ImageUploader value={editing.image} onChange={(url, pid) => setEditing({ ...editing, image: url, imagePublicId: pid })} aspectRatio="video" /></Field>
          <label className="flex items-center gap-2"><input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Hiển thị</label>
        </SimpleModal>
      )}
    </div>
  );
}

// ==================== DRUGS ====================
export function AdminDrugs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const { data, isLoading } = useDrugs({ page, limit: 20, search });
  const save = useSaveDrug();
  const remove = useDeleteDrug();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <Header title="Tra cứu thuốc" onAdd={() => setEditing({ isActive: true })} />
      <SearchBar value={search} onChange={setSearch} />
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          { key: "name", header: "Tên thuốc", render: (d: any) => <span className="font-medium">{d.name}</span> },
          { key: "activeIngredient", header: "Hoạt chất" },
          { key: "manufacturer", header: "NSX" },
          { key: "isBHYT", header: "BHYT", render: (d: any) => d.isBHYT ? "✓" : "—" },
          { key: "actions", header: "", width: "100px", render: (d: any) => <RowActions onEdit={() => setEditing(d)} onDelete={async () => { if (confirm("Xoá?")) await remove.mutateAsync(d.id); }} /> },
        ]}
      />
      {editing && (
        <SimpleModal size="lg" title={editing.id ? "Sửa thuốc" : "Thêm thuốc"} onClose={() => setEditing(null)} onSave={async () => { await save.mutateAsync(editing); setEditing(null); }} saving={save.isPending}>
          <Field label="Tên thuốc *"><input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hoạt chất"><input value={editing.activeIngredient || ""} onChange={(e) => setEditing({ ...editing, activeIngredient: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            <Field label="Hàm lượng"><input value={editing.strength || ""} onChange={(e) => setEditing({ ...editing, strength: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            <Field label="Dạng bào chế"><input value={editing.dosageForm || ""} onChange={(e) => setEditing({ ...editing, dosageForm: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            <Field label="Nhà sản xuất"><input value={editing.manufacturer || ""} onChange={(e) => setEditing({ ...editing, manufacturer: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            <Field label="Số đăng ký"><input value={editing.registrationNumber || ""} onChange={(e) => setEditing({ ...editing, registrationNumber: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
            <Field label="Xuất xứ"><input value={editing.country || ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></Field>
          </div>
          <Field label="Chỉ định"><textarea value={editing.indication || ""} onChange={(e) => setEditing({ ...editing, indication: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Chống chỉ định"><textarea value={editing.contraindication || ""} onChange={(e) => setEditing({ ...editing, contraindication: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Liều dùng"><textarea value={editing.dosage || ""} onChange={(e) => setEditing({ ...editing, dosage: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <Field label="Tác dụng phụ"><textarea value={editing.sideEffects || ""} onChange={(e) => setEditing({ ...editing, sideEffects: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" /></Field>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!editing.isBHYT} onChange={(e) => setEditing({ ...editing, isBHYT: e.target.checked })} /> Thuốc BHYT</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Hiển thị</label>
          </div>
        </SimpleModal>
      )}
    </div>
  );
}

// ==================== MESSAGES ====================
export function AdminMessages() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState("");
  const { data, isLoading } = useMessages({ page, limit: 20, status: status || undefined });
  const replyMut = useReplyMessage();
  const remove = useDeleteMessage();

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    await replyMut.mutateAsync({ id: selected.id, reply });
    setReply(""); setSelected(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hộp thư bạn đọc</h1>
        <p className="text-slate-500">Phản hồi tin nhắn từ người dân</p>
      </div>
      <div className="bg-white rounded-xl border p-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">Tất cả</option>
          <option value="new">Mới</option>
          <option value="processing">Đang xử lý</option>
          <option value="replied">Đã trả lời</option>
          <option value="closed">Đã đóng</option>
        </select>
      </div>
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          { key: "senderName", header: "Người gửi", render: (m: any) => <div><div className="font-medium">{m.senderName}</div><div className="text-xs text-slate-500">{m.senderEmail}</div></div> },
          { key: "subject", header: "Tiêu đề", render: (m: any) => <div className="max-w-xs truncate">{m.subject || m.message.slice(0, 60)}</div> },
          {
            key: "status", header: "Trạng thái",
            render: (m: any) => {
              const cls: any = { new: "bg-red-100 text-red-700", processing: "bg-amber-100 text-amber-700", replied: "bg-green-100 text-green-700", closed: "bg-slate-100 text-slate-700" };
              return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls[m.status]}`}>{m.status}</span>;
            },
          },
          { key: "createdAt", header: "Gửi lúc", render: (m: any) => new Date(m.createdAt).toLocaleString("vi-VN") },
          {
            key: "actions", header: "", width: "100px",
            render: (m: any) => (
              <div className="flex gap-1">
                <button onClick={() => { setSelected(m); setReply(m.adminReply || ""); }} className="p-1.5 hover:bg-slate-100 rounded text-blue-600"><MessageSquare className="w-4 h-4" /></button>
                <button onClick={async () => { if (confirm("Xoá?")) await remove.mutateAsync(m.id); }} className="p-1.5 hover:bg-slate-100 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            ),
          },
        ]}
      />
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-2">{selected.subject || "Thư từ " + selected.senderName}</h2>
            <div className="text-sm text-slate-500 mb-3">{selected.senderName} • {selected.senderEmail} • {selected.senderPhone}</div>
            <div className="p-3 bg-slate-50 rounded-lg text-sm whitespace-pre-wrap mb-4">{selected.message}</div>
            <label className="block text-sm font-medium mb-1">Phản hồi</label>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-lg" placeholder="Nhập nội dung phản hồi..." />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded-lg">Đóng</button>
              <button onClick={handleReply} disabled={replyMut.isPending || !reply.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Gửi phản hồi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== LOGS ====================
export function AdminLogs() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivityLogs({ page, limit: 30 });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Nhật ký hoạt động</h1>
        <p className="text-slate-500">Lịch sử các thao tác trong hệ thống</p>
      </div>
      <DataTable
        loading={isLoading} data={data?.items || []}
        columns={[
          { key: "createdAt", header: "Thời gian", width: "180px", render: (l: any) => new Date(l.createdAt).toLocaleString("vi-VN") },
          { key: "user", header: "Người thực hiện", render: (l: any) => l.user ? <div><div className="font-medium">{l.user.name}</div><div className="text-xs text-slate-500">{l.user.username}</div></div> : "Hệ thống" },
          { key: "action", header: "Hành động", render: (l: any) => <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{l.action}</code> },
          { key: "description", header: "Mô tả" },
          { key: "ipAddress", header: "IP", width: "130px" },
        ]}
      />
    </div>
  );
}

// ==================== Helpers ====================
function Header({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>
      <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
        <Plus className="w-4 h-4" /> Thêm mới
      </button>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-lg" placeholder="Tìm kiếm..." />
      </div>
    </div>
  );
}

function Badge({ active, labelOn = "Hoạt động", labelOff = "Ẩn" }: { active: boolean; labelOn?: string; labelOff?: string }) {
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{active ? labelOn : labelOff}</span>;
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onEdit} className="p-1.5 hover:bg-slate-100 rounded text-blue-600"><Edit className="w-4 h-4" /></button>
      <button onClick={onDelete} className="p-1.5 hover:bg-slate-100 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>{children}</div>;
}

function SimpleModal({ title, children, onClose, onSave, saving, size = "md" }: {
  title: string; children: React.ReactNode; onClose: () => void; onSave: () => void; saving: boolean; size?: "md" | "lg" | "xl";
}) {
  const sizeClass = { md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="p-5 border-t flex justify-end gap-2 bg-slate-50 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-slate-100">Huỷ</button>
          <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            <Save className="w-4 h-4 inline mr-1" />{saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
