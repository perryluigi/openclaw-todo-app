import type { Todo } from "./TodoTypes";

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (todo: Todo) => Promise<void>;
}

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const created = new Date(todo.createdAt).toLocaleString();

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-1 items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(todo)}
          className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold transition ${
            todo.completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500"
          }`}
        >
          {todo.completed ? "✓" : ""}
        </button>
        <div className="space-y-1">
          <h3
            className={`text-sm font-semibold ${
              todo.completed ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-xs text-slate-500">
              {todo.description}
            </p>
          )}
          <p className="text-[11px] text-slate-400">Created {created}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggle(todo)}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
        >
          {todo.completed ? "Mark Pending" : "Complete"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo)}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
