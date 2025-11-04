import { useState, useRef, useEffect } from "react";
import AddCardModal from "./components/AddCardModal";
import PaymentItem from "./components/PaymentItem";
import PayPalLogo from "../../../assets/paypal-logo.svg?react";
import VisaLogo from "../../../assets/visa-logo.svg?react";
import MasterCardLogo from "../../../assets/mastercard-logo.svg?react";
import DinersLogo from "../../../assets/diners-club-logo.svg?react";
import DiscoverLogo from "../../../assets/discover-logo.svg?react";
import PayPalGLogo from "../../../assets/paypal-logo-grayscaled.svg?react";

export default function Payment() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState(null);
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const pendingRef = useRef(null);

  const requestSelect = (index) => {
    if (index === 1) {
      setPendingIndex(1);
      pendingRef.current = setTimeout(() => {
        setCardModalOpen(true);
        setPendingIndex(null);
        pendingRef.current = null;
      }, 1500);
      return;
    }
    if (pendingRef.current !== null || selectedIndex === index) return;
    setPendingIndex(index);
    pendingRef.current = setTimeout(() => {
      setSelectedIndex(index);
      setPendingIndex(null);
      pendingRef.current = null;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
        pendingRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        className={`relative border-b pb-8 border-b-[rgb(229,229,229)] ${
          pendingIndex !== null ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {pendingIndex !== null && (
          <div className="absolute top-[50%] left-[50%] w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        )}

        <div className="pb-3 text-2xl font-bold">Pay with</div>

        <PaymentItem
          index={0}
          name="payment-method"
          checked={selectedIndex === 0}
          onRequestSelect={() => requestSelect(0)}
          logos={[
            <PayPalLogo key="pp" width={52} height={34} aria-label="PayPal" />,
          ]}
          title="Paypal"
        />

        <PaymentItem
          index={1}
          name="payment-method"
          checked={selectedIndex === 1}
          onRequestSelect={() => requestSelect(1)}
          logos={[
            <VisaLogo key="visa" width={32} height={20} aria-label="VISA" />,
            <MasterCardLogo
              key="mc"
              width={32}
              height={20}
              aria-label="Mastercard"
            />,
            <DiscoverLogo
              key="diners"
              width={32}
              height={20}
              aria-label="Diners Club"
            />,
            <DinersLogo
              key="diners"
              width={32}
              height={20}
              aria-label="Diners Club"
            />,
          ]}
          title="Add new card"
        />

        <PaymentItem
          index={2}
          name="payment-method"
          checked={selectedIndex === 2}
          onRequestSelect={() => requestSelect(2)}
          logos={[
            <PayPalGLogo
              key="ppg"
              width={52}
              height={34}
              aria-label="Diners Club"
              title="i"
            />,
          ]}
          title="i"
          disabled
        />
      </div>
      <AddCardModal
        open={isCardModalOpen}
        onClose={() => setCardModalOpen(false)}
      />
    </>
  );
}
