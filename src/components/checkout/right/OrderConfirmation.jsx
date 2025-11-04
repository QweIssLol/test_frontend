import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import PaypalUnavailableModal from "../../modals/PaypalUnavailableModal";
import AddCardModal from "../../checkout/left/components/AddCardModal";

const OrderConfirmation = () => {
  const { quantity, unitPrice, shipping, currency, currencySymbols } =
    useCart();
  const itemTotal = unitPrice * quantity;
  const orderTotal = itemTotal + shipping;
  const fmt = (n) => `${currencySymbols[currency] || "$"}${n.toFixed(2)}`;
  const [isPaypalModalOpen, setPaypalModalOpen] = useState(false);
  const [isCardModalOpen, setCardModalOpen] = useState(false);

  return (
    <section>
      <div className="bg-[rgb(247,247,247)] h-full rounded-2xl p-6 flex flex-col">
        <div className="text-2xl font-bold">Order Summary</div>

        <div className="mt-6 mb-3 pb-4 border-b border-gray-200">
          <div className="flex justify-between py-1">
            <div>Item ({quantity})</div>
            <div className="text-sm font-semibold">{fmt(itemTotal)}</div>
          </div>
          <div className="flex justify-between py-1">
            <div>Shipping</div>
            <div className="text-sm font-semibold">
              {shipping ? fmt(shipping) : "Free"}
            </div>
          </div>
        </div>

        <div className="pb-6">
          <div className="flex justify-between text-lg font-bold">
            <div>Order total</div>
            <div className="text-base font-bold">{fmt(orderTotal)}</div>
          </div>
        </div>

        <div className="text-xs font-semibold pb-6 text-gray-700">
          By clicking Pay, you agree to eBay's{" "}
          <a
            className="text-blue-800 cursor-pointer underline"
            href="https://pages.ebay.com/internationalshippingprogram/buyer/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            User Agreement
          </a>{" "}
          and acknowledge our{" "}
          <a
            className="text-blue-800 cursor-pointer underline"
            href="https://pages.ebay.com/internationalshippingprogram/buyer/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Notice
          </a>
          .
        </div>

        <div className="text-[0.95rem] font-bold text-gray-700 pb-2 self-center">
          You'll finish checkout on PayPal
        </div>

        <button
          className="bg-[rgb(0,112,186)] border-0 text-white text-lg rounded-full w-full h-12 cursor-pointer"
          onClick={() => setPaypalModalOpen(true)}
        >
          Pay with <span className="italic font-extrabold">PayPal</span>
        </button>

        <div className="pt-4 text-sm flex justify-center text-gray-700">
          Purchase protected by&nbsp;
          <a
            className="text-blue-800 font-bold underline"
            href="https://pages.ebay.com/ebay-money-back-guarantee/"
            target="_blank"
            rel="noopener noreferrer"
          >
            eBay Money Back Guarantee
          </a>
        </div>
      </div>

      <PaypalUnavailableModal
        open={isPaypalModalOpen}
        onClose={() => setPaypalModalOpen(false)}
        onAddCard={() => {
          setPaypalModalOpen(false);
          setCardModalOpen(true);
        }}
      />
      <AddCardModal
        open={isCardModalOpen}
        onClose={() => setCardModalOpen(false)}
      />
    </section>
  );
};

export default OrderConfirmation;
