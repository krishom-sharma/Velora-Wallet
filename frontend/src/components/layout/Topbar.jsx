import { Bell, Moon, Search, Sun } from "lucide-react";
import { Button } from "../common/Button";
import { useAppStore } from "../../store/uiStore";

export const Topbar = ({ title, unreadCount }) => {
  const { theme, setTheme, toggleNotifications, user } = useAppStore();

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-muted">Welcome back</p>
        <h2 className="text-3xl font-semibold tracking-tight text-text">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-2xl border border-border/80 bg-white/60 px-3 py-2 text-muted shadow-sm dark:bg-white/5 sm:flex">
          <Search className="h-4 w-4" />
          <span className="text-sm">Everything important, one surface.</span>
        </div>
        <Button
          variant="ghost"
          className="w-12 rounded-2xl p-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          className="relative w-12 rounded-2xl p-0"
          onClick={() => toggleNotifications()}
        >
          <Bell className="h-4 w-4" />
          {unreadCount ? (
            <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
          ) : null}
        </Button>
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white/70 px-3 py-2 shadow-sm dark:bg-white/5">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Velora")}&background=0F172A&color=fff`}
            alt={user?.name}
            className="h-10 w-10 rounded-2xl object-cover"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text">{user?.name}</p>
            <p className="text-xs text-muted">@{user?.username}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
