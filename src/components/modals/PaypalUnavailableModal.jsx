import { useEffect } from "react";

export default function PaypalUnavailableModal({ open, onClose, onAddCard }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const handleAddCard = () => {
    if (onClose) onClose();
    if (onAddCard) onAddCard();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-[480px] max-w-[95vw] mx-4 p-6 shadow-2xl">
        <div className="text-xl font-bold mb-3">PayPal not available</div>
        <div className="text-gray-700 mb-6">
          PayPal isn’t available for this order. Please add a card to continue.
        </div>
        <div className="flex justify-end">
          <button onClick={handleAddCard} className="px-6 py-2 bg-blue-600 text-white rounded-3xl">
            Add new card
          </button>
        </div>
      </div>
    </div>
  );
}


