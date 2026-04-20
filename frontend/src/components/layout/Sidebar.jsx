import { CreditCard, Gauge, Receipt, Send, Settings, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const items = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/payments", label: "Send & Receive", icon: Send },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings }
];

export const Sidebar = () => (
  <aside className="hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-[32px] border border-white/10 bg-slate-950/80 p-6 text-white shadow-glass lg:flex">
    <div className="rounded-[28px] bg-white/10 p-5">
      <p className="text-xs uppercase tracking-[0.26em] text-white/60">Velora Wallet</p>
      <h1 className="mt-3 text-2xl font-semibold leading-tight">
        Finance, designed like it belongs on glass.
      </h1>
    </div>

    <nav className="mt-8 space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive ? "bg-white text-slate-950" : "text-white/72 hover:bg-white/10"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>

    <div className="mt-auto rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
      Premium wallet flows, real-time movement, and Apple-inspired motion, built on the MERN stack.
    </div>
  </aside>
);
