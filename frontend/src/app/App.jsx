import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, bootstrapCsrf } from "../api/client";
import { useAppStore } from "../store/uiStore";
import { AppShell } from "../components/layout/AppShell";

const AuthPage = lazy(() => import("../pages/AuthPage").then((module) => ({ default: module.AuthPage })));
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({ default: module.DashboardPage }))
);
const PaymentsPage = lazy(() =>
  import("../pages/PaymentsPage").then((module) => ({ default: module.PaymentsPage }))
);
const TransactionsPage = lazy(() =>
  import("../pages/TransactionsPage").then((module) => ({ default: module.TransactionsPage }))
);
const CardsPage = lazy(() => import("../pages/CardsPage").then((module) => ({ default: module.CardsPage })));
const ProfilePage = lazy(() =>
  import("../pages/ProfilePage").then((module) => ({ default: module.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((module) => ({ default: module.SettingsPage }))
);

const Splash = () => (
  <div className="flex min-h-screen items-center justify-center px-6">
    <div className="glass-panel animated-grid w-full max-w-md rounded-[36px] p-10 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-muted">Velora Wallet</p>
      <h1 className="mt-4 text-3xl font-semibold text-text">Loading your financial surface</h1>
      <div className="mx-auto mt-6 h-2 w-40 overflow-hidden rounded-full bg-accent/10">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
      </div>
    </div>
  </div>
);

export const App = () => {
  const [csrfReady, setCsrfReady] = useState(false);
  const { setUser, user, setTheme } = useAppStore();

  useEffect(() => {
    bootstrapCsrf()
      .catch(() => null)
      .finally(() => setCsrfReady(true));
  }, []);

  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.user;
    },
    enabled: csrfReady,
    onSuccess: (nextUser) => {
      setUser(nextUser);
      if (nextUser?.theme) {
        setTheme(nextUser.theme);
      }
    },
    onError: () => {
      setUser(null);
    }
  });

  if (!csrfReady) {
    return <Splash />;
  }

  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
      </Routes>
    </Suspense>
  );
};
