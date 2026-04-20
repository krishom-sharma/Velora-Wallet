import { cn } from "../../utils/cn";

export const Skeleton = ({ className }) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl bg-gradient-to-r from-white/20 via-white/40 to-white/20 dark:from-white/5 dark:via-white/10 dark:to-white/5",
      className
    )}
  />
);
