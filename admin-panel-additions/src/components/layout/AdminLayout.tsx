import { Outlet, Navigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import {
  LayoutDashboard, FileText, FolderTree, Menu as MenuIcon, Image as ImageIcon,
  FileStack, Palette, Users, Settings, Building2, Stethoscope, Pill,
  Heart, CalendarCheck, MessageSquare, Activity, LogOut, ChevronLeft,
  ChevronRight, ChevronDown, BookOpen, Bell,
} from "lucide-react";
import FullPageLoader from "../ui/FullPageLoader";

interface NavGroup {
  label: string;
  items: {
    to: string;
    label: string;
    icon: any;
    badge?: number;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/analytics", label: "Thống kê truy cập", icon: Activity },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { to: "/admin/posts", label: "Bài viết", icon: FileText },
      { to: "/admin/categories", label: "Chuyên mục", icon: FolderTree },
      { to: "/admin/pages", label: "Trang tĩnh", icon: BookOpen },
      { to: "/admin/menus", label: "Menu website", icon: MenuIcon },
      { to: "/admin/banners", label: "Banner", icon: ImageIcon },
      { to: "/admin/media", label: "Thư viện Media", icon: FileStack },
    ],
  },
  {
    label: "Bệnh viện",
    items: [
      { to: "/admin/departments", label: "Khoa phòng", icon: Building2 },
      { to: "/admin/doctors", label: "Chuyên gia y tế", icon: Stethoscope },
      { to: "/admin/services", label: "Dịch vụ", icon: Heart },
      { to: "/admin/drugs", label: "Tra cứu thuốc", icon: Pill },
    ],
  },
  {
    label: "Tương tác",
    items: [
      { to: "/admin/appointments", label: "Đặt lịch khám", icon: CalendarCheck },
      { to: "/admin/messages", label: "Hộp thư bạn đọc", icon: MessageSquare },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { to: "/admin/users", label: "Người dùng", icon: Users },
      { to: "/admin/settings", label: "Cài đặt website", icon: Palette },
      { to: "/admin/logs", label: "Nhật ký hoạt động", icon: Bell },
    ],
  },
];

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (isLoading) return <FullPageLoader label="Đang xác thực..." />;
  if (!user) return <Navigate to="/admin/login" replace />;

  // Ẩn sidebar khi ở /admin/login
  if (location.pathname === "/admin/login") return <Outlet />;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-16" : "w-64"} bg-slate-900 text-slate-200 flex flex-col transition-all duration-200 sticky top-0 h-screen`}
      >
        {/* Logo + collapse */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white">L</div>
              <div>
                <div className="font-bold text-sm leading-tight">LIÊN CHIỂU</div>
                <div className="text-[10px] text-slate-400">Admin Portal</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_GROUPS.map((g) => (
            <div key={g.label} className="mb-3">
              {!collapsed && (
                <div className="px-4 mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {g.label}
                </div>
              )}
              <ul>
                {g.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge != null && item.badge > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-800 p-3 shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                {user.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name || user.email}</div>
                <div className="text-xs text-slate-400 capitalize">{user.role}</div>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => logout()}
              className="w-full p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 flex justify-center"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
