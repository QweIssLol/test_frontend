import { useState, useRef, useEffect } from "react";
import { useCart } from "../../../../context/CartContext";
import StyledSelect from "../../../common/StyledSelect";

const ShippingAddress = () => {
  const { shippingAddress, setShippingAddress } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(null);
  const [countryData, setCountryData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    return () => {
      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
        pendingRef.current = null;
      }
    };
  }, []);

  const onAddClick = () => {
    if (pending) return;
    setPending(true);
    pendingRef.current = setTimeout(() => {
      setPending(false);
      setShowForm(true);
      if (!countryData && !dataLoading) {
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
      pendingRef.current = null;
    }, 1500);
  };

  const [form, setForm] = useState({
    first: "",
    last: "",
    addr1: "",
    addr2: "",
    city: "",
    region: "",
    zip: "",
    country: "",
    phoneCode: "",
    phone: "",
    primary: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "country") {
      setForm((s) => ({ ...s, country: value, city: "", region: "" }));
    } else if (name === "city") {
      setForm((s) => ({ ...s, city: value, region: "" }));
    } else {
      setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.first) newErrors.first = "First name is required";
    if (!form.last) newErrors.last = "Last name is required";
    if (!form.addr1) newErrors.addr1 = "Street address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.zip) newErrors.zip = "ZIP code is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }

    if (pending) return;

    setPending(true);
    if (pendingRef.current) {
      clearTimeout(pendingRef.current);
      pendingRef.current = null;
    }
    pendingRef.current = setTimeout(() => {
      setShippingAddress({ ...form });
      setPending(false);
      setShowForm(false);
      pendingRef.current = null;
    }, 1500);
  };

  const onChangeClick = () => {
    if (!shippingAddress) return;
    setShippingAddress(null);
    setForm({ ...shippingAddress });
    setShowForm(true);
  };

  return (
    <div className={`py-8 border-b border-b-[rgb(229,229,229)] relative ${pending ? "opacity-50 pointer-events-none" : ""}`}>
      {pending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      <div className="font-bold text-3xl pb-6">Ship to</div>

      {!shippingAddress && !showForm && (
        <div>
          <label className="block text-gray-600">No address set yet.</label>
          <div className="underline cursor-pointer mt-4 inline-block text-black" onClick={onAddClick}>
            Add shipping address
          </div>
        </div>
      )}

      {showForm && (
        <form className="space-y-4 max-w-2xl" onSubmit={handleSubmit}>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 flex flex-col">
              <StyledSelect name="country" value={form.country} onChange={handleChange} className={`${submitted && errors.country ? "border-red-500" : ""}`}>
                <option value="">Country or region</option>
                {countryData &&
                  Object.keys(countryData).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </StyledSelect>
              {submitted && errors.country && <p className="text-red-500 text-sm mt-2">{errors.country}</p>}
            </div>
            <div className="col-span-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                name="first"
                value={form.first}
                onChange={handleChange}
                placeholder="First name"
                className={`p-3 border rounded ${submitted && errors.first ? "border-red-500" : ""}`}
              />
              {submitted && errors.first && <p className="text-red-500 text-sm mt-2">{errors.first}</p>}
            </div>
            <div className="flex flex-col">
              <input
                name="last"
                value={form.last}
                onChange={handleChange}
                placeholder="Last name"
                className={`p-3 border rounded ${submitted && errors.last ? "border-red-500" : ""}`}
              />
              {submitted && errors.last && <p className="text-red-500 text-sm mt-2">{errors.last}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                name="addr1"
                value={form.addr1}
                onChange={handleChange}
                placeholder="Street address"
                className={`p-3 border rounded ${submitted && errors.addr1 ? "border-red-500" : ""}`}
              />
              {submitted && errors.addr1 && <p className="text-red-500 text-sm mt-2">{errors.addr1}</p>}
            </div>
            <div className="flex flex-col">
              <input name="addr2" value={form.addr2} onChange={handleChange} placeholder="Street address 2 (optional)" className="p-3 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <StyledSelect name="city" value={form.city} onChange={handleChange} disabled={!form.country} className={`${submitted && errors.city ? "border-red-500" : ""}`}>
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
              {submitted && errors.city && <p className="text-red-500 text-sm mt-2">{errors.city}</p>}
            </div>
            <div className="flex flex-col">
              <StyledSelect name="region" value={form.region} onChange={handleChange} disabled={!form.city} className={`${submitted && errors.region ? "border-red-500" : ""}`}>
                <option value="">State/Province/Region</option>
                {form.country &&
                  form.city &&
                  ((countryData && countryData[form.country] && countryData[form.country].regions[form.city]) || []).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
              </StyledSelect>
              {submitted && errors.region && <p className="text-red-500 text-sm mt-2">{errors.region}</p>}
            </div>
            <div className="flex flex-col">
              <input type="text" name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP code" className={`p-3 border rounded ${submitted && errors.zip ? "border-red-500" : ""}`} />
              {submitted && errors.zip && <p className="text-red-500 text-sm mt-2">{errors.zip}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <StyledSelect name="phoneCode" value={form.phoneCode} onChange={handleChange} className="col-span-1">
              <option value="+1">+1</option>
              <option value="+48">+48</option>
              <option value="+44">+44</option>
              <option value="+49">+49</option>
              <option value="+33">+33</option>
              <option value="+7">+7</option>
              <option value="+39">+39</option>
              <option value="+34">+34</option>
              <option value="+61">+61</option>
              <option value="+81">+81</option>
              <option value="+91">+91</option>
              <option value="+55">+55</option>
              <option value="+52">+52</option>
              <option value="+86">+86</option>
            </StyledSelect>

            <div className="flex flex-col col-span-2">
              <input
                type="text"
                name="phone"
                placeholder="Phone number (required)"
                value={form.phone}
                onChange={handleChange}
                className={`p-3 border rounded ${submitted && errors.phone ? "border-red-500" : ""}`}
              />
              {submitted && errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <button type="submit" className="col-span-1 w-32 px-6 py-2 bg-blue-600 text-white rounded-3xl">
              Add
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="col-span-1 px-6 py-2 border rounded-3xl text-blue-600">
              Cancel
            </button>
            <div className="col-span-3" />
          </div>
        </form>
      )}

      {shippingAddress && (
        <div className="mt-4">
          <div className="font-medium">
            {shippingAddress.first} {shippingAddress.last}
          </div>
          <div>
            {shippingAddress.addr1}
            {shippingAddress.addr2 ? ", " + shippingAddress.addr2 : ""}
          </div>
          <div>
            {shippingAddress.city}
            {shippingAddress.region ? ", " + shippingAddress.region : ""}, {shippingAddress.country} {shippingAddress.zip}
          </div>
          <div>{shippingAddress.phone}</div>
          <div className="mt-2 underline cursor-pointer text-black" onClick={onChangeClick}>
            Change
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;


