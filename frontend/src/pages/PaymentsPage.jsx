import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle2, QrCode, ReceiptText, Send, Wallet } from "lucide-react";
import { api } from "../api/client";
import { useAppStore } from "../store/uiStore";
import { formatCurrency } from "../utils/format";
import { triggerHaptic } from "../utils/haptics";
import { CardPanel } from "../components/common/CardPanel";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { QrScannerView } from "../components/wallet/QrScannerView";
import { TransactionList } from "../components/wallet/TransactionList";

const tabs = ["send", "receive", "scan", "requests"];

export const PaymentsPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState("send");
  const [search, setSearch] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sendForm, setSendForm] = useState({ amount: "", note: "", category: "other" });
  const [requestForm, setRequestForm] = useState({
    requestFrom: "",
    amount: "",
    note: "",
    category: "other"
  });
  const [qrForm, setQrForm] = useState({ amount: "", note: "", category: "other" });
  const [qrData, setQrData] = useState(null);
  const [scanPayload, setScanPayload] = useState("");

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await api.get("/transactions");
      return data;
    }
  });

  const usersQuery = useQuery({
    queryKey: ["recipient-search", search],
    queryFn: async () => {
      const { data } = await api.get(`/users/search?q=${encodeURIComponent(search)}`);
      return data.users;
    },
    enabled: search.trim().length > 1
  });

  const updateDashboardPreview = (delta) => {
    queryClient.setQueryData(["dashboard"], (old) =>
      old ? { ...old, balance: old.balance + delta } : old
    );
  };

  const sendMoney = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/transactions/send", {
        recipient,
        amount: Number(sendForm.amount),
        note: sendForm.note,
        category: sendForm.category
      });
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      updateDashboardPreview(-Number(sendForm.amount || 0));
    },
    onSuccess: () => {
      toast.success("Transfer sent");
      triggerHaptic([10, 28, 10]);
      setSendForm({ amount: "", note: "", category: "other" });
      setRecipient("");
      setSearch("");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      updateDashboardPreview(Number(sendForm.amount || 0));
      toast.error(err.response?.data?.message || "Unable to send money");
    }
  });

  const requestMoney = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/transactions/request", {
        ...requestForm,
        amount: Number(requestForm.amount)
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Payment request sent");
      triggerHaptic([10, 24, 10]);
      setRequestForm({ requestFrom: "", amount: "", note: "", category: "other" });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Unable to request money");
    }
  });

  const createQr = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/transactions/qr/generate", {
        amount: qrForm.amount ? Number(qrForm.amount) : undefined,
        note: qrForm.note
      });
      return data;
    },
    onSuccess: (data) => {
      setQrData(data);
      toast.success("QR ready to receive");
    }
  });

  const payWithQr = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/transactions/qr/process", {
        payload: scanPayload,
        amount: qrForm.amount ? Number(qrForm.amount) : undefined,
        note: qrForm.note,
        category: qrForm.category
      });
      return data;
    },
    onSuccess: () => {
      toast.success("QR payment complete");
      triggerHaptic([12, 26, 12]);
      setScanPayload("");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "QR payment failed");
    }
  });

  const payRequest = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/transactions/requests/${id}/pay`);
      return data;
    },
    onSuccess: () => {
      toast.success("Request paid");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  });

  const suggestions = usersQuery.data || [];
  const pendingRequests = transactionsQuery.data?.pendingRequests || [];
  const recentTransactions = transactionsQuery.data?.transactions?.slice(0, 4) || [];

  useEffect(() => {
    if (activeTab !== "send") {
      setSearch("");
    }
  }, [activeTab]);

  const qrLabel = useMemo(
    () => (qrForm.amount ? `Request ${formatCurrency(qrForm.amount)}` : "Dynamic receive QR"),
    [qrForm.amount]
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <CardPanel>
        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-white/60 text-muted dark:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "send" ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-text">Send money instantly</h3>
              <p className="text-sm text-muted">
                Search by email or username and confirm with live validation.
              </p>
            </div>

            <Input
              label="Recipient"
              placeholder="Search @username or email"
              value={search || recipient}
              onChange={(event) => {
                setSearch(event.target.value);
                setRecipient(event.target.value);
              }}
            />

            {suggestions.length ? (
              <div className="space-y-2">
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setRecipient(item.username);
                      setSearch(`@${item.username}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/80 bg-white/60 px-4 py-3 text-left dark:bg-white/5"
                  >
                    <img
                      src={
                        item.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0F172A&color=fff`
                      }
                      alt={item.name}
                      className="h-10 w-10 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-text">{item.name}</p>
                      <p className="text-xs text-muted">@{item.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Amount"
                type="number"
                min="1"
                placeholder="120"
                value={sendForm.amount}
                onChange={(event) =>
                  setSendForm((prev) => ({ ...prev, amount: event.target.value }))
                }
              />
              <Input
                label="Category"
                as="select"
                value={sendForm.category}
                onChange={(event) =>
                  setSendForm((prev) => ({ ...prev, category: event.target.value }))
                }
              >
                {["other", "food", "travel", "shopping", "housing", "utilities", "gifts"].map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </Input>
            </div>

            <Input
              label="Note"
              placeholder="Dinner split"
              value={sendForm.note}
              onChange={(event) => setSendForm((prev) => ({ ...prev, note: event.target.value }))}
            />

            <Button className="w-full" onClick={() => sendMoney.mutate()} disabled={sendMoney.isPending}>
              <Send className="h-4 w-4" />
              {sendMoney.isPending ? "Sending..." : "Confirm transfer"}
            </Button>
          </div>
        ) : null}

        {activeTab === "receive" ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-text">Receive money your way</h3>
              <p className="text-sm text-muted">
                Request funds directly or generate a QR code for instant wallet payments.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Request from"
                placeholder="Email or @username"
                value={requestForm.requestFrom}
                onChange={(event) =>
                  setRequestForm((prev) => ({ ...prev, requestFrom: event.target.value }))
                }
              />
              <Input
                label="Amount"
                type="number"
                min="1"
                value={requestForm.amount}
                onChange={(event) =>
                  setRequestForm((prev) => ({ ...prev, amount: event.target.value }))
                }
              />
            </div>
            <Input
              label="Category"
              as="select"
              value={requestForm.category}
              onChange={(event) =>
                setRequestForm((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              {["other", "food", "travel", "shopping", "gifts", "utilities"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Input>
            <Input
              label="Note"
              value={requestForm.note}
              onChange={(event) =>
                setRequestForm((prev) => ({ ...prev, note: event.target.value }))
              }
              placeholder="Contribution for trip"
            />
            <Button className="w-full" onClick={() => requestMoney.mutate()}>
              <ReceiptText className="h-4 w-4" />
              Send request
            </Button>

            <div className="rounded-[28px] border border-border/80 bg-white/60 p-5 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{qrLabel}</p>
                  <h4 className="text-lg font-semibold text-text">@{user?.username}</h4>
                </div>
                <Button variant="ghost" size="sm" onClick={() => createQr.mutate()}>
                  <QrCode className="h-4 w-4" />
                  Generate QR
                </Button>
              </div>
              {qrData ? (
                <div className="mt-5 rounded-[28px] bg-white p-4">
                  <img src={qrData.qrCode} alt="Receive QR code" className="mx-auto h-56 w-56" />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeTab === "scan" ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-text">Pay from QR</h3>
              <p className="text-sm text-muted">
                Use the camera scanner or paste a payload from any Velora wallet QR.
              </p>
            </div>
            <QrScannerView onScan={setScanPayload} />
            <Input
              label="Scanned payload"
              as="textarea"
              rows={4}
              value={scanPayload}
              onChange={(event) => setScanPayload(event.target.value)}
              placeholder='{"recipientId":"..."}'
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Amount override"
                type="number"
                min="1"
                value={qrForm.amount}
                onChange={(event) => setQrForm((prev) => ({ ...prev, amount: event.target.value }))}
              />
              <Input
                label="Category"
                as="select"
                value={qrForm.category}
                onChange={(event) =>
                  setQrForm((prev) => ({ ...prev, category: event.target.value }))
                }
              >
                {["other", "food", "travel", "shopping", "gifts", "utilities"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Input>
            </div>
            <Input
              label="Note"
              value={qrForm.note}
              onChange={(event) => setQrForm((prev) => ({ ...prev, note: event.target.value }))}
              placeholder="QR payment"
            />
            <Button className="w-full" onClick={() => payWithQr.mutate()}>
              <CheckCircle2 className="h-4 w-4" />
              Complete QR payment
            </Button>
          </div>
        ) : null}

        {activeTab === "requests" ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-text">Pending requests</h3>
              <p className="text-sm text-muted">
                Approve money requests that were sent to you.
              </p>
            </div>
            {pendingRequests.length ? (
              pendingRequests.map((item) => (
                <div
                  key={item._id}
                  className="rounded-[28px] border border-border/80 bg-white/60 p-5 dark:bg-white/5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted">Requested by @{item.receiver?.username}</p>
                      <p className="mt-2 text-2xl font-semibold text-text">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="mt-1 text-sm text-muted">{item.note || "Requested transfer"}</p>
                    </div>
                    <Button onClick={() => payRequest.mutate(item._id)}>
                      <ArrowUpRight className="h-4 w-4" />
                      Pay request
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-border/80 p-8 text-center text-sm text-muted">
                No pending requests right now.
              </div>
            )}
          </div>
        ) : null}
      </CardPanel>

      <div className="space-y-4">
        <CardPanel className="bg-slate-950 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/60">Wallet balance</p>
              <p className="mt-2 text-4xl font-semibold">
                {formatCurrency(
                  queryClient.getQueryData(["dashboard"])?.balance ?? user?.balance ?? 0
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <Wallet className="h-5 w-5 text-cyan-300" />
            </div>
          </div>
        </CardPanel>

        <CardPanel>
          <div className="mb-4">
            <p className="text-sm text-muted">Recent movement</p>
            <h3 className="text-xl font-semibold text-text">Latest activity</h3>
          </div>
          <TransactionList
            transactions={recentTransactions}
            currentUserId={user?._id}
            compact
          />
        </CardPanel>
      </div>
    </div>
  );
};
