export function formatDateLong(d: string) {
  "use client";
  const date = new Date(d);
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(
      date
    );
  } catch {
    return date.toDateString();
  }
}
export function formatDateShort(d: string) {
  "use client";

  const date = new Date(d);

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
