export function formatDateLong(d: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(d);
  } catch {
    return d.toDateString();
  }
}
export function formatDateShort(d: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
}
