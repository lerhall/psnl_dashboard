import { ToggleForm } from "@/components/row-actions";
import { Badge, Card, Empty, Problem } from "@/components/ui";
import { toggleTodo } from "@/lib/actions/todos";
import { getTodos } from "@/lib/data/queries";
import { relativeDayLabel, urgencyFor } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { getToday } from "@/lib/today";

/** Open to-dos, soonest due first. Tick them off right from the dashboard. */
export async function TodosWidget() {
  const { today } = await getToday();
  const result = await safely(() => getTodos({ includeCompleted: false }));

  return (
    <Card title="To-do" href="/todos">
      {result.error !== null ? (
        <Problem title="Couldn't load to-dos">{result.error}</Problem>
      ) : result.data.length === 0 ? (
        <Empty>All clear. Nothing to do.</Empty>
      ) : (
        <ul className="space-y-2">
          {result.data.slice(0, 7).map((todo) => (
            <li key={todo.id} className="flex items-start gap-2.5 text-sm">
              <ToggleForm action={toggleTodo} id={todo.id} current={todo.completed} label={`Mark "${todo.title}" done`} />
              <span className="min-w-0 flex-1">{todo.title}</span>
              {todo.due_date && <Badge urgency={urgencyFor(todo.due_date, today)}>{relativeDayLabel(todo.due_date, today)}</Badge>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
