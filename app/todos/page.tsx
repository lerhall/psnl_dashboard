import type { Metadata } from "next";
import { Suspense } from "react";
import { DeleteForm, ToggleForm } from "@/components/row-actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Empty, PageHeader, Problem } from "@/components/ui";
import { clearCompletedTodos, createTodo, deleteTodo, toggleTodo } from "@/lib/actions/todos";
import { getTodos } from "@/lib/data/queries";
import { formatDay, relativeDayLabel, urgencyFor } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { getToday } from "@/lib/today";

export const metadata: Metadata = { title: "To-do" };

/** The full list: open tasks, then completed ones. */
async function TodoList() {
  const { today } = await getToday();
  const result = await safely(() => getTodos());
  if (result.error !== null) return <Problem title="Couldn't load to-dos">{result.error}</Problem>;

  const open = result.data.filter((t) => !t.completed);
  const done = result.data.filter((t) => t.completed);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">Open ({open.length})</h2>
        {open.length === 0 ? (
          <Empty>Nothing to do. Nice.</Empty>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
            {open.map((todo) => (
              <li key={todo.id} className="flex items-start gap-3 p-3">
                <ToggleForm action={toggleTodo} id={todo.id} current={false} label={`Mark "${todo.title}" done`} />
                <div className="min-w-0 flex-1">
                  <p>{todo.title}</p>
                  {todo.notes && <p className="text-sm text-muted">{todo.notes}</p>}
                </div>
                {todo.due_date && (
                  <Badge urgency={urgencyFor(todo.due_date, today)}>
                    {relativeDayLabel(todo.due_date, today)} · {formatDay(todo.due_date)}
                  </Badge>
                )}
                <DeleteForm action={deleteTodo} id={todo.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted">Completed ({done.length})</h2>
            <form action={clearCompletedTodos}>
              <button type="submit" className="text-xs text-muted hover:text-red-600">Clear completed</button>
            </form>
          </div>
          <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
            {done.map((todo) => (
              <li key={todo.id} className="flex items-start gap-3 p-3 text-muted">
                <ToggleForm action={toggleTodo} id={todo.id} current label={`Mark "${todo.title}" not done`} />
                <p className="min-w-0 flex-1 line-through">{todo.title}</p>
                <DeleteForm action={deleteTodo} id={todo.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function TodosPage() {
  return (
    <>
      <PageHeader title="To-do" description="Tasks with optional due dates." />

      {/* The form resets itself after a successful submit (React 19 form actions) */}
      <form action={createTodo} className="mb-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[1fr_11rem_auto] sm:items-end">
        <div>
          <label htmlFor="todo-title" className="label">Task</label>
          <input id="todo-title" name="title" required placeholder="What needs doing?" className="input" />
        </div>
        <div>
          <label htmlFor="todo-due" className="label">Due date</label>
          <input id="todo-due" name="dueDate" type="date" className="input" />
        </div>
        <SubmitButton>Add task</SubmitButton>
        <div className="sm:col-span-3">
          <label htmlFor="todo-notes" className="label">Notes (optional)</label>
          <input id="todo-notes" name="notes" className="input" />
        </div>
      </form>

      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <TodoList />
      </Suspense>
    </>
  );
}
