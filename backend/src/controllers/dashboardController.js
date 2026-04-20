import { Card } from "../models/Card.js";
import { Transaction } from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardAnalytics } from "../services/transactionService.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [cards, recentTransactions, analytics] = await Promise.all([
    Card.find({ userId: req.user.id }).sort({ createdAt: -1 }),
    Transaction.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate("sender", "name username avatar")
      .populate("receiver", "name username avatar")
      .sort({ createdAt: -1 })
      .limit(7),
    getDashboardAnalytics(req.user._id)
  ]);

  return res.status(200).json({
    balance: req.user.balance,
    cards,
    recentTransactions,
    analytics
  });
});
