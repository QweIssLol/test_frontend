import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../../../context/CartContext";

export default function CurrencyModal({ open, onClose, onConfirm }) {
  const { currency, setCurrency, currencyRates, currencySymbols } = useCart();
  const [selected, setSelected] = useState(currency || "USD");
  const [suggested, setSuggested] = useState(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const fallbackFromLang = () => {
      try {
        const lang = navigator.language || "";
        const region = (lang.split("-")[1] || "").toUpperCase();
        if (region === "PL") return "PLN";
        if (region === "GB") return "GBP";
        if (["DE", "FR", "ES", "IT", "NL"].includes(region)) return "EUR";
        return null;
      } catch (_) {
        return null;
      }
    };

    const setByCountryCode = (cc) => {
      if (cancelled) return;
      if (cc === "PL") setSuggested("PLN");
      else if (cc === "GB") setSuggested("GBP");
      else if (["DE", "FR", "ES", "IT", "NL"].includes(cc)) setSuggested("EUR");
      else setSuggested(fallbackFromLang());
    };

    const tryGeolocate = () => {
      if (!navigator.geolocation) {
        setSuggested(fallbackFromLang());
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            const res = await fetch(url);
            const data = await res.json();
            const cc =
              (data && (data.countryCode || data.countryCodeIso2)) || "";
            setByCountryCode((cc || "").toUpperCase());
          } catch (_) {
            setSuggested(fallbackFromLang());
          }
        },
        () => setSuggested(fallbackFromLang()),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    };

    tryGeolocate();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const rateText = useMemo(() => {
    if (!suggested || !currencyRates[suggested]) return "";
    const perSuggestedInUSD = 1 / currencyRates[suggested];
    const symbolSuggested = currencySymbols[suggested] || suggested;
    const usdSymbol = currencySymbols["USD"] || "$";
    return `Current conversion rate: ${symbolSuggested}1 = ${usdSymbol}${perSuggestedInUSD.toFixed(
      5
    )}`;
  }, [suggested, currencyRates, currencySymbols]);

  const continueLabel = `Continue in ${selected}`;

  const onContinue = () => {
    setCurrency(selected);
    onConfirm && onConfirm(selected);
    onClose && onClose();
  };

  useEffect(() => {
    if (open) setSelected(currency || "USD");
  }, [open, currency]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[560px] max-w-[95vw] mx-4 p-6 shadow-2xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div className="text-[20px] font-bold mb-4">
          Select a currency for this purchase
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="currency"
              checked={selected === "USD"}
              onChange={() => setSelected("USD")}
              className="mt-1 accent-blue-500"
            />
            <div>
              <div className="font-semibold">
                United States Dollar (USD) - $
              </div>
              <div className="text-sm text-gray-600">
                Your card issuer may charge foreign transaction fees.
              </div>
            </div>
          </label>

          {suggested && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="currency"
                checked={selected === suggested}
                onChange={() => setSelected(suggested)}
                className="mt-1 accent-blue-500"
              />
              <div>
                <div className="font-semibold">
                  {suggested === "PLN"
                    ? "Polish Zloty (PLN) - zł"
                    : suggested === "EUR"
                    ? "Euro (EUR) - €"
                    : "British Pound (GBP) - £"}
                </div>
                <div className="text-sm text-gray-600">{rateText}</div>
              </div>
            </label>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-full text-blue-600"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="px-5 py-2 bg-blue-600 text-white rounded-full"
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
