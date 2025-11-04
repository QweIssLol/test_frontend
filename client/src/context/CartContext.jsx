import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);
  const unitPriceUSD = 499.99; // base currency USD
  const shippingUSD = quantity * 45;

  const [currency, setCurrency] = useState("USD");
  const currencyRates = {
    USD: 1,
    PLN: 3.84, // 1 USD = 3.84 PLN (example)
    EUR: 0.92,
    GBP: 0.79,
  };
  const currencySymbols = { USD: "$", PLN: "zł", EUR: "€", GBP: "£" };

  const rate = currencyRates[currency] || 1;

  const formatPrice = (amountUSD) => {
    const sym = currencySymbols[currency] || "$";
    const val = amountUSD * rate;
    return `${sym}${val.toFixed(2)}`;
  };

  const unitPrice = useMemo(() => unitPriceUSD * rate, [unitPriceUSD, rate]);
  const shipping = useMemo(() => shippingUSD * rate, [shippingUSD, rate]);

  const value = {
    quantity,
    setQuantity,
    unitPrice, // already converted to selected currency
    shipping, // already converted to selected currency
    formatPrice,
    currency,
    setCurrency,
    currencySymbols,
    currencyRates,
    rate,
    shippingAddress,
    setShippingAddress,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
