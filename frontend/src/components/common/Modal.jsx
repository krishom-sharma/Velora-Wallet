import { AnimatePresence, motion } from "framer-motion";

export const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/30 p-4 backdrop-blur-md sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-panel w-full max-w-lg rounded-[32px] p-6"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text">{title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ring-focus rounded-full border border-border/70 p-2 text-muted"
            >
              ✕
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
