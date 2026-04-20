import { useEffect, useMemo } from "react";
import { useLocation, useOutlet, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { api } from "../../api/client";
import { useAppStore } from "../../store/uiStore";
import { triggerHaptic } from "../../utils/haptics";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NotificationCenter } from "../notifications/NotificationCenter";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const titles = {
  "/": "Your Wallet",
  "/payments": "Send & Receive",
  "/transactions": "Transaction History",
  "/cards": "Cards",
  "/profile": "Profile",
  "/settings": "Settings"
};

export const AppShell = () => {
  const outlet = useOutlet();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, theme, setTheme } = useAppStore();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
    enabled: Boolean(user)
  });

  const unreadCount = useMemo(
    () => (notificationsQuery.data?.notifications || []).filter((item) => !item.isRead).length,
    [notificationsQuery.data]
  );

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const resolvedTheme = theme === "system" ? "dark" : theme;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (!user) return undefined;

    const socket = io(SOCKET_URL, {
      withCredentials: true
    });

    socket.on("notification:new", (notification) => {
      queryClient.setQueryData(["notifications"], (old) => ({
        ...old,
        notifications: [notification, ...(old?.notifications || [])]
      }));
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast(notification.title, { description: notification.body });
      triggerHaptic([12, 30, 12]);
    });

    socket.on("balance:updated", ({ balance }) => {
      queryClient.setQueryData(["dashboard"], (old) =>
        old ? { ...old, balance } : old
      );
      queryClient.setQueryData(["profile"], (old) =>
        old ? { ...old, profile: { ...old.profile, balance } } : old
      );
    });

    socket.on("transaction:created", () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    });

    socket.on("transaction:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    });

    socket.on("transaction:request", () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, user]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      useAppStore.getState().setUser(null);
      toast.success("Session closed securely");
    }
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <div className="relative min-h-screen px-4 py-4 lg:px-5">
        <div className="mx-auto flex max-w-[1600px] gap-4">
          <Sidebar />
          <main className="min-h-[calc(100vh-2rem)] flex-1 rounded-[32px] border border-white/10 bg-white/35 p-4 shadow-soft backdrop-blur-xl dark:bg-slate-950/35 sm:p-6">
            <Topbar title={titles[location.pathname] || "Velora"} unreadCount={unreadCount} />

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-2xl border border-border/80 bg-white/70 px-4 py-2 text-sm font-medium text-text shadow-sm dark:bg-white/5"
              >
                Theme: {theme}
              </button>
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                className="rounded-2xl border border-border/80 bg-white/70 px-4 py-2 text-sm font-medium text-text shadow-sm dark:bg-white/5"
              >
                Secure logout
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <NotificationCenter notifications={notificationsQuery.data?.notifications || []} />
      <MobileNav />
    </>
  );
};
