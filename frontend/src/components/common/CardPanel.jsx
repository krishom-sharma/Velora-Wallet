import { cn } from "../../utils/cn";

export const CardPanel = ({ className, children }) => (
  <section className={cn("glass-panel rounded-[28px] p-5 sm:p-6", className)}>
    {children}
  </section>
);
