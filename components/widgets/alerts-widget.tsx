import { ALERT_CATEGORY_META } from "@/components/alert-categories";
import { Badge, Card, Empty, Problem } from "@/components/ui";
import { getAlerts } from "@/lib/data/queries";
import { formatDay } from "@/lib/dates";
import { safely } from "@/lib/safe";

/** Active hackathons, competitions, music news, deals and thrifts. */
export async function AlertsWidget() {
  const result = await safely(() => getAlerts());

  return (
    <Card title="Personal alerts" href="/alerts">
      {result.error !== null ? (
        <Problem title="Couldn't load alerts">{result.error}</Problem>
      ) : result.data.length === 0 ? (
        <Empty>No alerts. Add hackathons, deals and the like on the Alerts page.</Empty>
      ) : (
        <ul className="space-y-2.5">
          {result.data.slice(0, 6).map((alert) => {
            const meta = ALERT_CATEGORY_META[alert.category];
            return (
              <li key={alert.id} className="flex items-start gap-2 text-sm">
                <Badge className={meta.className}>{meta.label}</Badge>
                <div className="min-w-0 flex-1">
                  {alert.url ? (
                    <a href={alert.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {alert.title}
                    </a>
                  ) : (
                    alert.title
                  )}
                  {alert.date && <p className="text-xs text-muted">{formatDay(alert.date)}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
