import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  empty?: ReactNode;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selected?: string[];
  onSelectChange?: (ids: string[]) => void;
  getRowId?: (item: T) => string;
}

export default function DataTable<T extends { id?: any }>({
  data, columns, loading,
  empty = "Chưa có dữ liệu",
  onRowClick,
  selectable = false,
  selected = [],
  onSelectChange,
  getRowId = (item) => String(item.id),
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selected.length === data.length;
  const toggleAll = () => {
    if (!onSelectChange) return;
    onSelectChange(allSelected ? [] : data.map(getRowId));
  };
  const toggleOne = (id: string) => {
    if (!onSelectChange) return;
    onSelectChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left">
            {selectable && (
              <th className="w-10 p-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={`p-3 text-xs font-semibold text-slate-600 uppercase tracking-wider ${c.className || ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin inline mr-2" />
                Đang tải...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-12 text-center text-slate-500">
                {empty}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const id = getRowId(item);
              return (
                <tr
                  key={id}
                  className={`border-b border-slate-100 hover:bg-slate-50 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(id)}
                        onChange={() => toggleOne(id)}
                        className="rounded"
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={`p-3 text-sm ${c.className || ""}`}>
                      {c.render ? c.render(item) : (item as any)[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
