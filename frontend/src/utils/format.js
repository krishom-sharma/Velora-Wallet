import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO
} from "date-fns";

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(Number(value || 0));

export const formatDateHeading = (date) => {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (isToday(parsed)) return "Today";
  if (isYesterday(parsed)) return "Yesterday";
  return format(parsed, "EEEE, MMM d");
};

export const formatCardExpiry = (month, year) => `${month}/${year}`;

export const formatRelativeTime = (value) =>
  formatDistanceToNow(new Date(value), { addSuffix: true });

export const formatMonthLabel = (monthIndex, year) =>
  format(new Date(year, monthIndex - 1, 1), "MMM");
