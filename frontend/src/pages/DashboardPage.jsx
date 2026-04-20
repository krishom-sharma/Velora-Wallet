import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Sparkles } from "lucide-react";
import { api } from "../api/client";
import { useAppStore } from "../store/uiStore";
import { formatCurrency } from "../utils/format";
import { Button } from "../components/common/Button";
import { CardPanel } from "../components/common/CardPanel";
import { Skeleton } from "../components/common/Skeleton";
import { WalletCarousel } from "../components/wallet/WalletCarousel";
import { TransactionList } from "../components/wallet/TransactionList";
import { CategoryDonutChart, SpendTrendChart } from "../components/wallet/Charts";

export const DashboardPage = () => {
  const { user } = useAppStore();
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/summary");
      return data;
    }
  });

  if (dashboardQuery.isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Skeleton className="h-[280px] rounded-[32px]" />
        <Skeleton className="h-[280px] rounded-[32px]" />
        <Skeleton className="h-[360px] rounded-[32px]" />
        <Skeleton className="h-[360px] rounded-[32px]" />
      </div>
    );
  }

  const data = dashboardQuery.data;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
      <CardPanel className="relative overflow-hidden border-0 bg-slate-950 p-0 text-white xl:col-span-1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,134,255,0.4),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(33,255,196,0.2),transparent_26%)]" />
        <div className="relative grid gap-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/65">Available balance</p>
              <h3 className="mt-3 text-5xl font-semibold tracking-tight">
                {formatCurrency(data.balance)}
              </h3>
            </div>
            <div className="rounded-[24px] bg-white/10 px-4 py-3 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Wallet pulse</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-medium">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                Live & synced
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="primary" className="justify-start bg-white text-slate-950">
              <ArrowUpRight className="h-4 w-4" />
              Send money
            </Button>
            <Button variant="ghost" className="justify-start border-white/15 bg-white/10 text-white">
              <ArrowDownLeft className="h-4 w-4" />
              Receive with QR
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/60">Cards stored</p>
              <p className="mt-3 text-3xl font-semibold">{data.cards.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/60">Recent activity</p>
              <p className="mt-3 text-3xl font-semibold">{data.recentTransactions.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/60">Identity</p>
              <p className="mt-3 text-2xl font-semibold">@{user?.username}</p>
            </div>
          </div>
        </div>
      </CardPanel>

      <CardPanel>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Cards</p>
            <h3 className="text-xl font-semibold text-text">Apple Wallet-inspired stack</h3>
          </div>
          <div className="rounded-2xl bg-accent/10 p-3 text-accent">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
        <WalletCarousel cards={data.cards} />
      </CardPanel>

      <CardPanel>
        <div className="mb-5">
          <p className="text-sm text-muted">Spending analytics</p>
          <h3 className="text-xl font-semibold text-text">Six-month spend trend</h3>
        </div>
        <SpendTrendChart data={data.analytics.monthlySpend} />
      </CardPanel>

      <CardPanel>
        <div className="mb-5">
          <p className="text-sm text-muted">Category mix</p>
          <h3 className="text-xl font-semibold text-text">This month&apos;s breakdown</h3>
        </div>
        <CategoryDonutChart data={data.analytics.categoryBreakdown} />
      </CardPanel>

      <CardPanel className="xl:col-span-2">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Recent transactions</p>
            <h3 className="text-xl font-semibold text-text">Movement at a glance</h3>
          </div>
        </div>
        <TransactionList transactions={data.recentTransactions} currentUserId={user?._id} />
      </CardPanel>
    </div>
  );
};
