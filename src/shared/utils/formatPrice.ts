export type Currency = "USD" | "RD";

export const formatPrice = (
  value: number,
  currency: Currency,
  locale = "en-US"
) => {
  const symbol = currency === "USD" ? "US$" : "RD$";
  return `${symbol} ${value.toLocaleString(locale)}`;
};
