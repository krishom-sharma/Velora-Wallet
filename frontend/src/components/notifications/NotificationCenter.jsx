import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing } from "lucide-react";
import { api } from "../../api/client";
import { useAppStore } from "../../store/uiStore";
import { formatRelativeTime } from "../../utils/format";
import { Button } from "../common/Button";

export const NotificationCenter = ({ notifications = [] }) => {
  const { notificationsOpen, toggleNotifications } = useAppStore();
  const queryClient = useQueryClient();

  const markAll = useMutation({
    mutationFn: async () => {
      await api.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old) => ({
        ...old,
        notifications: (old?.notifications || []).map((item) => ({
          ...item,
          isRead: true
        }))
      }));
    }
  });

  return (
    <AnimatePresence>
      {notificationsOpen ? (
        <motion.div
          className="fixed right-4 top-4 z-50 w-[min(26rem,calc(100vw-2rem))]"
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
        >
          <div className="glass-panel rounded-[32px] p-5 shadow-glass">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text">Notifications</h3>
                <p className="text-sm text-muted">Live transaction and security updates</p>
              </div>
              <button
                type="button"
                onClick={() => toggleNotifications(false)}
                className="ring-focus rounded-full border border-border/70 p-2 text-muted"
              >
                ✕
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mb-4 w-full"
              onClick={() => markAll.mutate()}
            >
              Mark all as read
            </Button>

            <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
              {notifications.length ? (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-[24px] border border-border/70 bg-white/60 p-4 dark:bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-accent/10 p-2 text-accent">
                        <BellRing className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-text">{item.title}</p>
                          {!item.isRead ? (
                            <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase text-accent">
                              New
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-muted">{item.body}</p>
                        <p className="mt-2 text-xs text-muted">
                          {formatRelativeTime(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-border/70 p-6 text-center text-sm text-muted">
                  You&apos;re all caught up.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
