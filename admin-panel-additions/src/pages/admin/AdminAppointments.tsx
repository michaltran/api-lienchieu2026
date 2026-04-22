import { useState } from "react";
import { useAppointments, useConfirmAppointment, useCancelAppointment, useDeleteAppointment } from "../../hooks/useAdminResources";
import DataTable from "../../components/admin/DataTable";
import { Check, X, Trash2, Search, Eye } from "lucide-react";

export default function AdminAppointments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useAppointments({ page, limit: 20, search, status: status || undefined });
  const confirm = useConfirmAppointment();
  const cancel = useCancelAppointment();
  const remove = useDeleteAppointment();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Đặt lịch khám</h1>
        <p className="text-slate-500">Duyệt và quản lý các đăng ký đặt lịch</p>
      </div>

      <div className="bg-white rounded-xl border p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên/SĐT/email..." className="w-full pl-10 pr-3 py-2 border rounded-lg" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="confirmed">Đã duyệt</option>
          <option value="completed">Đã hoàn thành</option>
          <option value="cancelled">Đã huỷ</option>
        </select>
      </div>

      <DataTable
        loading={isLoading}
        data={data?.items || []}
        columns={[
          {
            key: "patient", header: "Bệnh nhân",
            render: (a) => (
              <div>
                <div className="font-medium">{a.patientName}</div>
                <div className="text-xs text-slate-500">{a.patientPhone} {a.patientEmail && `• ${a.patientEmail}`}</div>
              </div>
            ),
          },
          {
            key: "department", header: "Khoa / Bác sĩ",
            render: (a) => (
              <div className="text-sm">
                <div>{a.department?.name || "—"}</div>
                <div className="text-slate-500">{a.doctor?.name || "Chưa chọn"}</div>
              </div>
            ),
          },
          {
            key: "schedule", header: "Thời gian",
            render: (a) => (
              <div className="text-sm">
                {a.preferredDate ? new Date(a.preferredDate).toLocaleDateString("vi-VN") : "—"}
                {a.preferredTime && ` ${a.preferredTime}`}
              </div>
            ),
          },
          {
            key: "status", header: "Trạng thái",
            render: (a) => {
              const map: Record<string, { label: string; class: string }> = {
                pending: { label: "Chờ duyệt", class: "bg-amber-100 text-amber-700" },
                confirmed: { label: "Đã duyệt", class: "bg-green-100 text-green-700" },
                completed: { label: "Hoàn thành", class: "bg-blue-100 text-blue-700" },
                cancelled: { label: "Đã huỷ", class: "bg-red-100 text-red-700" },
              };
              const s = map[a.status];
              return <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.class}`}>{s.label}</span>;
            },
          },
          {
            key: "createdAt", header: "Gửi lúc",
            render: (a) => new Date(a.createdAt || "").toLocaleString("vi-VN"),
          },
          {
            key: "actions", header: "", width: "160px",
            render: (a) => (
              <div className="flex items-center gap-1">
                <button onClick={() => setSelected(a)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Xem chi tiết">
                  <Eye className="w-4 h-4" />
                </button>
                {a.status === "pending" && (
                  <>
                    <button
                      onClick={async () => await confirm.mutateAsync({ id: a.id })}
                      className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Duyệt"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        const note = prompt("Lý do huỷ (tuỳ chọn):");
                        await cancel.mutateAsync({ id: a.id, note: note || undefined });
                      }}
                      className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Huỷ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={async () => { if (confirm("Xoá?")) await remove.mutateAsync(a.id); }}
                  className="p-1.5 hover:bg-slate-100 rounded text-red-600" title="Xoá"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-4">Chi tiết lịch khám</h2>
            <dl className="space-y-2 text-sm">
              <Row k="Họ tên" v={selected.patientName} />
              <Row k="Điện thoại" v={selected.patientPhone} />
              <Row k="Email" v={selected.patientEmail} />
              <Row k="Ngày sinh" v={selected.patientBirthday} />
              <Row k="Giới tính" v={selected.patientGender} />
              <Row k="Địa chỉ" v={selected.patientAddress} />
              <Row k="Khoa" v={selected.department?.name} />
              <Row k="Bác sĩ" v={selected.doctor?.name} />
              <Row k="Ngày khám mong muốn" v={selected.preferredDate} />
              <Row k="Giờ khám mong muốn" v={selected.preferredTime} />
              <Row k="Triệu chứng" v={selected.symptoms} />
              <Row k="Ghi chú bệnh nhân" v={selected.note} />
              <Row k="Ghi chú admin" v={selected.adminNote} />
            </dl>
            <button onClick={() => setSelected(null)} className="mt-4 w-full py-2 border rounded-lg hover:bg-slate-50">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Row = ({ k, v }: any) => v ? (
  <div className="grid grid-cols-[140px_1fr] gap-2 py-1 border-b border-slate-100">
    <dt className="text-slate-500">{k}</dt>
    <dd>{v}</dd>
  </div>
) : null;
