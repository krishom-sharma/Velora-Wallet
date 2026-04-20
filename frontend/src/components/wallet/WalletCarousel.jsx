import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCardExpiry } from "../../utils/format";
import { cn } from "../../utils/cn";
import { Button } from "../common/Button";

export const WalletCarousel = ({ cards = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = cards[activeIndex];

  if (!cards.length) {
    return (
      <div className="rounded-[30px] border border-dashed border-border/80 p-8 text-center text-sm text-muted">
        Add your first card to unlock quick Apple Wallet-style actions.
      </div>
    );
  }

  const paginate = (direction) => {
    setActiveIndex((current) => (current + direction + cards.length) % cards.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[32px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active._id}
            drag="x"
            onDragEnd={(_event, info) => {
              if (info.offset.x > 60) paginate(-1);
              if (info.offset.x < -60) paginate(1);
            }}
            initial={{ opacity: 0, x: 28, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -28, rotate: -2 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className={cn(
              "wallet-card-shine relative isolate overflow-hidden rounded-[32px] border border-white/20 p-6 text-white shadow-glass",
              "bg-gradient-to-br",
              active.gradient
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.36),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_30%)]" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70">{active.brand}</p>
                <h3 className="mt-6 text-3xl font-semibold tracking-[0.18em]">
                  {active.maskedCardNumber}
                </h3>
              </div>
              <div className="rounded-2xl bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur-md">
                {active.isPrimary ? "Primary" : "Wallet"}
              </div>
            </div>

            <div className="relative mt-10 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Card holder</p>
                <p className="mt-2 text-lg font-medium">{active.cardHolderName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Expires</p>
                <p className="mt-2 text-lg font-medium">
                  {formatCardExpiry(active.expiryMonth, active.expiryYear)}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {cards.map((item, index) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2.5 rounded-full transition",
                index === activeIndex ? "w-8 bg-accent" : "w-2.5 bg-border"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => paginate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => paginate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
