import type { TodoStatusFilter } from "./TodoTypes";

interface TodoFilterProps {
  value: TodoStatusFilter;
  onChange: (value: TodoStatusFilter) => void;
}

const tabs: { label: string; value: TodoStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

export function TodoFilter({ value, onChange }: TodoFilterProps) {
  return (
    <div className="mb-4 flex gap-2 rounded-full bg-slate-100 p-1 text-xs font-medium text-slate-600">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`flex-1 rounded-full px-3 py-1 transition ${
              active
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                : "hover:bg-white hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
