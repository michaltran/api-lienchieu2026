import { Link } from "react-router-dom";
import {
  FileText, Users, Building2, Stethoscope, CalendarCheck, MessageSquare,
  TrendingUp, Eye, Image as ImageIcon, FolderTree,
} from "lucide-react";
import { useDashboardStats } from "../../hooks/useAdminResources";
import LoadingLogo from "../../components/ui/LoadingLogo";

const statCards = [
  { key: "posts", label: "Bài viết", icon: FileText, color: "bg-blue-500", link: "/admin/posts" },
  { key: "categories", label: "Chuyên mục", icon: FolderTree, color: "bg-emerald-500", link: "/admin/categories" },
  { key: "media", label: "Media", icon: ImageIcon, color: "bg-purple-500", link: "/admin/media" },
  { key: "departments", label: "Khoa phòng", icon: Building2, color: "bg-orange-500", link: "/admin/departments" },
  { key: "doctors", label: "Chuyên gia", icon: Stethoscope, color: "bg-teal-500", link: "/admin/doctors" },
  { key: "users", label: "Người dùng", icon: Users, color: "bg-slate-600", link: "/admin/users" },
];

export default function AdminDashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingLogo /></div>;
  const stats = data;
  const c = stats?.counts;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Tổng quan hệ thống quản trị</p>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/appointments?status=pending" className="bg-amber-50 border border-amber-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-amber-600" />
            <div>
              <div className="text-2xl font-bold text-amber-900">{stats?.appointments.pending || 0}</div>
              <div className="text-sm text-amber-700">Lịch khám chờ duyệt</div>
            </div>
          </div>
        </Link>
        <Link to="/admin/messages?status=new" className="bg-rose-50 border border-rose-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-rose-600" />
            <div>
              <div className="text-2xl font-bold text-rose-900">{stats?.messages.new || 0}</div>
              <div className="text-sm text-rose-700">Hộp thư mới</div>
            </div>
          </div>
        </Link>
        <Link to="/admin/posts?status=draft" className="bg-sky-50 border border-sky-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-sky-600" />
            <div>
              <div className="text-2xl font-bold text-sky-900">{stats?.posts.draft || 0}</div>
              <div className="text-sm text-sky-700">Bài viết nháp</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <Link
            key={s.key}
            to={s.link}
            className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{(c as any)?.[s.key] ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Bài viết gần đây</h2>
            <Link to="/admin/posts" className="text-sm text-blue-600 hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-3">
            {(stats?.recentPosts || []).slice(0, 5).map((p: any) => (
              <Link
                key={p.id}
                to={`/admin/posts/${p.id}`}
                className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
              >
                <div className="w-12 h-12 bg-slate-100 rounded flex-shrink-0 overflow-hidden">
                  {p.coverUrl && <img src={p.coverUrl} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.title}</div>
                  <div className="text-xs text-slate-500">
                    {p.category?.name || "Chưa phân loại"} • {p.status}
                  </div>
                </div>
              </Link>
            ))}
            {(!stats?.recentPosts || stats.recentPosts.length === 0) && (
              <div className="text-center text-sm text-slate-400 py-6">Chưa có bài viết nào</div>
            )}
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Hoạt động mới</h2>
            <Link to="/admin/logs" className="text-sm text-blue-600 hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-3">
            {(stats?.recentLogs || []).slice(0, 7).map((l: any) => (
              <div key={l.id} className="flex items-start gap-3 text-sm">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                  {l.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-700">
                    <b>{l.user?.name || "Hệ thống"}</b> {l.description}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(l.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
            ))}
            {(!stats?.recentLogs || stats.recentLogs.length === 0) && (
              <div className="text-center text-sm text-slate-400 py-6">Chưa có hoạt động nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
