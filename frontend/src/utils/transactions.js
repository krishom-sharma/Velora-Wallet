import { formatDateHeading } from "./format";

export const resolveCounterparty = (transaction, currentUserId) => {
  const outgoing = transaction.sender?._id === currentUserId || transaction.sender === currentUserId;
  return outgoing ? transaction.receiver : transaction.sender;
};

export const resolveDirection = (transaction, currentUserId) => {
  const outgoing = transaction.sender?._id === currentUserId || transaction.sender === currentUserId;
  if (transaction.status === "requested") {
    return "request";
  }
  return outgoing ? "debit" : "credit";
};

export const groupTransactionsByDate = (transactions) =>
  transactions.reduce((groups, transaction) => {
    const key = formatDateHeading(transaction.createdAt);
    groups[key] = groups[key] || [];
    groups[key].push(transaction);
    return groups;
  }, {});
