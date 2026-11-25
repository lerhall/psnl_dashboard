import { describe, expect, it } from "vitest";
import { addDays, daysBetween, relativeDayLabel, toISODate, urgencyFor } from "@/lib/dates";

describe("date helpers", () => {
  it("formats an instant as a calendar day in the dashboard timezone", () => {
    // 23:30 UTC in summer is already the next day in London (BST, UTC+1)
    expect(toISODate(new Date("2026-07-01T23:30:00Z"), "Europe/London")).toBe("2026-07-02");
    expect(toISODate(new Date("2026-12-01T23:30:00Z"), "Europe/London")).toBe("2026-12-01");
  });

  it("counts whole days across DST changes", () => {
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(daysBetween("2026-11-24", "2026-11-20")).toBe(-4);
  });

  it("adds days across month boundaries", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("labels relative days", () => {
    expect(relativeDayLabel("2026-11-24", "2026-11-24")).toBe("Today");
    expect(relativeDayLabel("2026-11-25", "2026-11-24")).toBe("Tomorrow");
    expect(relativeDayLabel("2026-11-28", "2026-11-24")).toBe("In 4 days");
    expect(relativeDayLabel("2026-11-21", "2026-11-24")).toBe("3 days ago");
  });

  it("buckets urgency", () => {
    expect(urgencyFor(null, "2026-11-24")).toBe("none");
    expect(urgencyFor("2026-11-23", "2026-11-24")).toBe("overdue");
    expect(urgencyFor("2026-11-24", "2026-11-24")).toBe("today");
    expect(urgencyFor("2026-11-27", "2026-11-24")).toBe("soon");
    expect(urgencyFor("2026-12-10", "2026-11-24")).toBe("later");
  });
});
