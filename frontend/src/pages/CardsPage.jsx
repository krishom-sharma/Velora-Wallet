import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { api } from "../api/client";
import { Button } from "../components/common/Button";
import { CardPanel } from "../components/common/CardPanel";
import { Input } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { WalletCarousel } from "../components/wallet/WalletCarousel";
import { formatCardExpiry } from "../utils/format";

export const CardsPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiry: ""
  });

  const cardsQuery = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data } = await api.get("/cards");
      return data.cards;
    }
  });

  const addCard = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/cards", form);
      return data.card;
    },
    onSuccess: () => {
      toast.success("Card added");
      setOpen(false);
      setForm({ cardHolderName: "", cardNumber: "", expiry: "" });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Unable to add card");
    }
  });

  const removeCard = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/cards/${id}`);
    },
    onSuccess: () => {
      toast.success("Card removed");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  const cards = cardsQuery.data || [];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <CardPanel>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Digital wallet</p>
            <h3 className="text-xl font-semibold text-text">Your active cards</h3>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add card
          </Button>
        </div>
        <WalletCarousel cards={cards} />
      </CardPanel>

      <CardPanel>
        <div className="mb-5">
          <p className="text-sm text-muted">Manage details</p>
          <h3 className="text-xl font-semibold text-text">Stored securely</h3>
        </div>
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card._id}
              className="rounded-[28px] border border-border/80 bg-white/60 p-5 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-text">{card.maskedCardNumber}</p>
                  <p className="mt-1 text-sm text-muted">
                    {card.brand} • {formatCardExpiry(card.expiryMonth, card.expiryYear)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{card.cardHolderName}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeCard.mutate(card._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardPanel>

      <Modal open={open} onClose={() => setOpen(false)} title="Add a new card">
        <div className="space-y-4">
          <Input
            label="Card holder name"
            value={form.cardHolderName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, cardHolderName: event.target.value }))
            }
          />
          <Input
            label="Card number"
            value={form.cardNumber}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                cardNumber: event.target.value.replace(/\D/g, "")
              }))
            }
            placeholder="4242424242424242"
          />
          <Input
            label="Expiry"
            value={form.expiry}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, expiry: event.target.value }))
            }
            placeholder="09/28"
          />
          <Button className="w-full" onClick={() => addCard.mutate()}>
            Save card
          </Button>
        </div>
      </Modal>
    </div>
  );
};
