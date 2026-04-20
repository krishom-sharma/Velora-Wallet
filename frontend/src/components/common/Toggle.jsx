import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={cn(
      "ring-focus relative flex h-8 w-14 items-center rounded-full border transition",
      checked
        ? "border-accent/70 bg-accent/90"
        : "border-border bg-white/50 dark:bg-white/10"
    )}
  >
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute left-1 h-6 w-6 rounded-full bg-white shadow-md"
      style={{ x: checked ? 24 : 0 }}
    />
  </button>
);
