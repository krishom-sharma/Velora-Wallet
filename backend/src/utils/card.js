const cardPatterns = [
  { brand: "Visa", regex: /^4[0-9]{12}(?:[0-9]{3})?$/ },
  { brand: "Mastercard", regex: /^(5[1-5][0-9]{14}|2(?:2[2-9]|[3-6][0-9]|7[01])[0-9]{12}|2720[0-9]{12})$/ },
  { brand: "Amex", regex: /^3[47][0-9]{13}$/ },
  { brand: "Discover", regex: /^6(?:011|5[0-9]{2})[0-9]{12}$/ }
];

export const getCardBrand = (cardNumber) =>
  cardPatterns.find((item) => item.regex.test(cardNumber))?.brand || "Card";

export const maskCardNumber = (cardNumber) =>
  `•••• ${cardNumber.slice(-4)}`;

export const cardGradientByBrand = (brand) => {
  const gradients = {
    Visa: "from-sky-500 via-cyan-400 to-teal-300",
    Mastercard: "from-amber-500 via-rose-400 to-orange-300",
    Amex: "from-violet-500 via-indigo-400 to-cyan-300",
    Discover: "from-emerald-500 via-lime-400 to-teal-300",
    Card: "from-slate-800 via-slate-700 to-slate-500"
  };
  return gradients[brand] || gradients.Card;
};
