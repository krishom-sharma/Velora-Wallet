import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  QrCode,
  WalletCards
} from "lucide-react";
import { formatCurrency, formatRelativeTime } from "../../utils/format";
import { resolveCounterparty, resolveDirection } from "../../utils/transactions";
import { cn } from "../../utils/cn";

const iconMap = {
  debit: ArrowUpRight,
  credit: ArrowDownLeft,
  request: Clock3,
  qr: QrCode
};

export const TransactionList = ({ transactions = [], currentUserId, compact = false }) => (
  <div className="space-y-3">
    {transactions.map((transaction) => {
      const direction = resolveDirection(transaction, currentUserId);
      const party = resolveCounterparty(transaction, currentUserId);
      const Icon = transaction.type === "qr" ? iconMap.qr : iconMap[direction];

      return (
        <div
          key={transaction._id}
          className={cn(
            "flex items-center gap-4 rounded-[24px] border border-border/70 bg-white/60 px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:bg-white/5",
            compact && "px-3 py-3"
          )}
        >
          <div
            className={cn(
              "rounded-2xl p-3",
              direction === "credit"
                ? "bg-success/10 text-success"
                : direction === "request"
                  ? "bg-amber-400/10 text-amber-500"
                  : "bg-accent/10 text-accent"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-text">
                {direction === "credit"
                  ? `From ${party?.name || "Unknown"}`
                  : direction === "request"
                    ? `Requested by ${party?.name || "Unknown"}`
                    : `To ${party?.name || "Unknown"}`}
              </p>
              {transaction.type === "request" ? (
                <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-semibold uppercase text-amber-500">
                  Request
                </span>
              ) : transaction.type === "qr" ? (
                <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase text-accent">
                  QR
                </span>
              ) : null}
            </div>
            <p className="mt-1 truncate text-sm text-muted">
              {transaction.note || transaction.category || "Wallet transfer"}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <WalletCards className="h-3.5 w-3.5" />
              <span>{formatRelativeTime(transaction.createdAt)}</span>
            </div>
          </div>

          <div className="text-right">
            <p
              className={cn(
                "text-sm font-semibold",
                direction === "credit" ? "text-success" : "text-text"
              )}
            >
              {direction === "credit" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
              {transaction.status}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);
