export const EmptyState = ({ title, body }) => (
  <div className="rounded-[28px] border border-dashed border-border/80 bg-white/30 p-8 text-center dark:bg-white/5">
    <h3 className="text-lg font-semibold text-text">{title}</h3>
    <p className="mt-2 text-sm text-muted">{body}</p>
  </div>
);
