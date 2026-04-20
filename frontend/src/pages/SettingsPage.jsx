import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../api/client";
import { useAppStore } from "../store/uiStore";
import { triggerHaptic } from "../utils/haptics";
import { CardPanel } from "../components/common/CardPanel";
import { Toggle } from "../components/common/Toggle";

const Section = ({ title, body, action }) => (
  <div className="flex items-center justify-between gap-4 rounded-[28px] border border-border/80 bg-white/60 px-5 py-4 dark:bg-white/5">
    <div>
      <h4 className="text-sm font-semibold text-text">{title}</h4>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
    {action}
  </div>
);

export const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { setTheme } = useAppStore();

  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      return data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch("/settings", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
      if (data.theme) {
        setTheme(data.theme);
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
      triggerHaptic(10);
      toast.success("Settings updated");
    }
  });

  const settings = settingsQuery.data;

  if (!settings) {
    return null;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <CardPanel>
        <div className="mb-5">
          <p className="text-sm text-muted">Appearance</p>
          <h3 className="text-xl font-semibold text-text">Theme preferences</h3>
        </div>
        <div className="space-y-3">
          {["light", "dark", "system"].map((themeOption) => (
            <button
              key={themeOption}
              type="button"
              onClick={() => updateSettings.mutate({ theme: themeOption })}
              className={`w-full rounded-[28px] border px-5 py-4 text-left transition ${
                settings.theme === themeOption
                  ? "border-accent bg-accent/10"
                  : "border-border/80 bg-white/60 dark:bg-white/5"
              }`}
            >
              <p className="text-sm font-semibold capitalize text-text">{themeOption}</p>
              <p className="mt-1 text-sm text-muted">
                {themeOption === "system"
                  ? "Follow the device appearance automatically."
                  : `Use ${themeOption} mode across the wallet.`}
              </p>
            </button>
          ))}
        </div>
      </CardPanel>

      <CardPanel>
        <div className="mb-5">
          <p className="text-sm text-muted">Notifications</p>
          <h3 className="text-xl font-semibold text-text">Preferences</h3>
        </div>
        <div className="space-y-3">
          <Section
            title="Push notifications"
            body="Get transaction alerts in real time."
            action={
              <Toggle
                checked={settings.notificationPreferences.push}
                onChange={(value) =>
                  updateSettings.mutate({
                    notificationPreferences: {
                      ...settings.notificationPreferences,
                      push: value
                    }
                  })
                }
              />
            }
          />
          <Section
            title="Email updates"
            body="Receive important wallet activity by email."
            action={
              <Toggle
                checked={settings.notificationPreferences.email}
                onChange={(value) =>
                  updateSettings.mutate({
                    notificationPreferences: {
                      ...settings.notificationPreferences,
                      email: value
                    }
                  })
                }
              />
            }
          />
          <Section
            title="Product updates"
            body="Occasional release notes and new feature alerts."
            action={
              <Toggle
                checked={settings.notificationPreferences.marketing}
                onChange={(value) =>
                  updateSettings.mutate({
                    notificationPreferences: {
                      ...settings.notificationPreferences,
                      marketing: value
                    }
                  })
                }
              />
            }
          />
        </div>
      </CardPanel>

      <CardPanel className="xl:col-span-2">
        <div className="mb-5">
          <p className="text-sm text-muted">Security</p>
          <h3 className="text-xl font-semibold text-text">Protection layers</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Section
            title="Biometric lock"
            body="Require a trusted unlock gesture before showing sensitive wallet details."
            action={
              <Toggle
                checked={settings.security.biometricLock}
                onChange={(value) =>
                  updateSettings.mutate({
                    security: { ...settings.security, biometricLock: value }
                  })
                }
              />
            }
          />
          <Section
            title="Login alerts"
            body="Notify you about new sessions and unusual sign-ins."
            action={
              <Toggle
                checked={settings.security.loginAlerts}
                onChange={(value) =>
                  updateSettings.mutate({
                    security: { ...settings.security, loginAlerts: value }
                  })
                }
              />
            }
          />
          <Section
            title="Trusted device mode"
            body="Reduce repetitive prompts on your current device."
            action={
              <Toggle
                checked={settings.security.trustedDeviceMode}
                onChange={(value) =>
                  updateSettings.mutate({
                    security: { ...settings.security, trustedDeviceMode: value }
                  })
                }
              />
            }
          />
        </div>
      </CardPanel>
    </div>
  );
};
