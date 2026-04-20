import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-white/90 text-slate-900 shadow-soft hover:bg-white dark:bg-white dark:text-slate-900",
  accent:
    "bg-accent text-white hover:brightness-110 shadow-soft",
  ghost:
    "bg-white/8 text-text hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10",
  danger:
    "bg-danger text-white hover:brightness-110 shadow-soft"
};

export const Button = ({
  children,
  className,
  variant = "accent",
  size = "md",
  ...props
}) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 500, damping: 28 }}
    className={cn(
      "ring-focus inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 font-medium transition duration-200",
      variants[variant],
      size === "sm" ? "h-10 px-3 text-sm" : "h-12 px-4 text-sm",
      className
    )}
    {...props}
  >
    {children}
  </motion.button>
);
