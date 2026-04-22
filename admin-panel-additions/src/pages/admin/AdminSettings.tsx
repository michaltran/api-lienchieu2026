import { useEffect, useState } from "react";
import { useSettingsGrouped, useBulkUpdateSettings } from "../../hooks/useAdminResources";
import ImageUploader from "../../components/admin/ImageUploader";
import { Save, Loader2 } from "lucide-react";
import LoadingLogo from "../../components/ui/LoadingLogo";

const GROUP_LABELS: Record<string, string> = {
  logo: "Logo & Nhận diện",
  general: "Thông tin chung",
  contact: "Liên hệ",
  social: "Mạng xã hội",
  footer: "Chân trang",
  seo: "SEO",
  theme: "Giao diện",
  appointment: "Đặt lịch khám",
};

export default function AdminSettings() {
  const { data: grouped, isLoading } = useSettingsGrouped();
  const bulk = useBulkUpdateSettings();
  const [values, setValues] = useState<Record<string, any>>({});
  const [activeGroup, setActiveGroup] = useState("logo");

  useEffect(() => {
    if (grouped) {
      const flat: Record<string, any> = {};
      Object.values(grouped).flat().forEach((s: any) => {
        flat[s.key] = s.value;
      });
      setValues(flat);
    }
  }, [grouped]);

  const handleSave = async () => {
    const items = Object.entries(values).map(([key, value]) => ({ key, value }));
    await bulk.mutateAsync(items);
    alert("Đã lưu cài đặt");
  };

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingLogo /></div>;

  const groups = Object.keys(grouped || {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cài đặt Website</h1>
          <p className="text-slate-500">Cấu hình chung cho toàn bộ website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={bulk.isPending}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {bulk.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 h-fit">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeGroup === g ? "bg-blue-600 text-white font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {GROUP_LABELS[g] || g}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-lg text-slate-800 mb-4 pb-3 border-b">
            {GROUP_LABELS[activeGroup] || activeGroup}
          </h2>
          <div className="space-y-5">
            {(grouped?.[activeGroup] || []).map((s: any) => (
              <SettingField
                key={s.key}
                setting={s}
                value={values[s.key]}
                onChange={(v) => setValues({ ...values, [s.key]: v })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingField({ setting, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{setting.label || setting.key}</label>
      {setting.description && <p className="text-xs text-slate-500 mb-2">{setting.description}</p>}

      {setting.type === "image" ? (
        <ImageUploader value={value} onChange={(url) => onChange(url || "")} aspectRatio="video" />
      ) : setting.type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      ) : setting.type === "boolean" ? (
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value === "true" || value === true}
            onChange={(e) => onChange(String(e.target.checked))}
          />
          <span className="text-sm">Bật</span>
        </label>
      ) : setting.type === "color" ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-10 border rounded cursor-pointer"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
          />
        </div>
      ) : setting.type === "json" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
        />
      ) : (
        <input
          type={setting.type === "number" ? "number" : "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      )}
    </div>
  );
}
