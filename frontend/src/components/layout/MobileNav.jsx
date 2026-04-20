import { CreditCard, Gauge, Receipt, Send, Settings, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const items = [
  { to: "/", icon: Gauge, label: "Home" },
  { to: "/payments", icon: Send, label: "Pay" },
  { to: "/transactions", icon: Receipt, label: "History" },
  { to: "/cards", icon: CreditCard, label: "Cards" },
  { to: "/profile", icon: UserRound, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" }
];

export const MobileNav = () => (
  <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[28px] border border-white/20 bg-slate-950/80 px-2 py-2 text-white shadow-glass backdrop-blur-2xl lg:hidden">
    <div className="grid grid-cols-6 gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition",
                isActive ? "bg-white text-slate-950" : "text-white/70"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </div>
  </nav>
);
