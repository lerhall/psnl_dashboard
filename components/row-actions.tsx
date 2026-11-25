// Tiny forms that call server actions for one row (tick off, archive, delete).
// They're plain <form>s, so they even work before JavaScript has loaded.

type Action = (form: FormData) => Promise<void>;

/**
 * Round checkbox-style button. Sends the row id and its CURRENT flag value;
 * the server action stores the opposite.
 */
export function ToggleForm({
  action,
  id,
  field = "completed",
  current,
  label,
}: {
  action: Action;
  id: number;
  field?: string;
  current: boolean;
  label: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name={field} value={String(current)} />
      <button
        type="submit"
        aria-label={label}
        title={label}
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] transition-colors ${
          current ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"
        }`}
      >
        {current ? "✓" : ""}
      </button>
    </form>
  );
}

/** Small "×" delete button. */
export function DeleteForm({ action, id, label = "Delete" }: { action: Action; id: number; label?: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={label}
        title={label}
        className="rounded px-1.5 text-lg leading-none text-muted opacity-60 transition hover:text-red-600 hover:opacity-100"
      >
        ×
      </button>
    </form>
  );
}
