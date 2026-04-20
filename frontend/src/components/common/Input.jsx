import { cn } from "../../utils/cn";

export const Input = ({
  label,
  hint,
  error,
  className,
  as: Tag = "input",
  ...props
}) => (
  <label className="block space-y-2">
    {label ? (
      <span className="text-sm font-medium text-text/85">{label}</span>
    ) : null}
    <Tag
      className={cn(
        "ring-focus w-full rounded-2xl border border-border/80 bg-white/70 px-4 py-3 text-sm text-text placeholder:text-muted shadow-sm transition dark:bg-white/5",
        error && "border-danger/70",
        className
      )}
      {...props}
    />
    {error ? <p className="text-xs text-danger">{error}</p> : null}
    {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
  </label>
);
