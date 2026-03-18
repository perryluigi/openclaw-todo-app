import { useEffect, useMemo, useState } from "react";
import type { Todo, TodoStatusFilter } from "./components/TodoTypes";
import { TodoForm } from "./components/TodoForm";
import { TodoCard } from "./components/TodoCard";
import { TodoFilter } from "./components/TodoFilter";

const API_BASE = "/api";

async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  return res.json();
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      const data = await fetchJSON(`${API_BASE}/todos?${params.toString()}`);
      setTodos(data);
    } catch (err: any) {
      setError(err.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const totalCount = todos.length;
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  const handleCreate = async (data: { title: string; description?: string }) => {
    await fetchJSON(`${API_BASE}/todos`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    await loadTodos();
  };

  const handleToggle = async (todo: Todo) => {
    await fetchJSON(`${API_BASE}/todos/${todo.id}/toggle`, {
      method: "PATCH",
    });
    await loadTodos();
  };

  const handleDelete = async (todo: Todo) => {
    await fetch(`${API_BASE}/todos/${todo.id}`, { method: "DELETE" });
    await loadTodos();
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <main className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              OpenClaw Todo App
            </h1>
            <p className="text-sm text-slate-500">
              Stay on top of what matters today.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
              <span className="font-semibold text-slate-900">{totalCount}</span>{" "}
              total
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-100">
              {completedCount} completed
            </div>
          </div>
        </header>

        <TodoForm onCreate={handleCreate} />

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <TodoFilter value={statusFilter} onChange={setStatusFilter} />
          </div>

          {error && (
            <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-100">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading todos...</p>
          ) : todos.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-600">No todos yet.</p>
              <p className="mt-1 text-xs">
                Add your first task above and watch your list come to life.
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
