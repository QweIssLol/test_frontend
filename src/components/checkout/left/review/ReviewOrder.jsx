import SellerLogo from "../../../../assets/order-seller-logo.svg?react";
import IphoneLogo from "../../../../assets/iphone-15.svg?react";
import QuantityDropdown from "../../../common/QuantityDropdown";
import { useCart } from "../../../../context/CartContext";

const ReviewOrder = () => {
  const { setQuantity, unitPrice, shipping, currency, currencySymbols } = useCart();
  const sym = currencySymbols[currency] || "$";
  return (
    <div className="py-8 border-b border-b-[rgb(229,229,229)]">
      <div className="text-2xl font-bold pb-6">Review order</div>
      <div className="flex items-center">
        <SellerLogo width={32} height={32} className="pr-2" />
        <div className="flex flex-col">
          <p className="text-[0.875rem]">Supplytronics</p>
          <p className="text-[0.75rem]">99.1% positive feedback</p>
        </div>
      </div>
      <div className="pt-2 flex">
        <div className="w-24">
          <IphoneLogo className="w-full h-auto" />
        </div>
        <div>
          <div className="flex flex-col">
            <p className="text-[0.875rem]">Apple iPhone 15 128GB Factory Unlocked AT&T T-Mobile Verizon Excellent Condition</p>
            <p className="text-[rgb(118,118,118)] mb-2">Color: Black</p>
            <p className="flex items-center gap-1 pb-4">{`${sym}${unitPrice.toFixed(2)}`}</p>
            <QuantityDropdown onChange={(n) => setQuantity(n)} />
            <p className="my-4 pt-2 text-[0.875rem] font-bold">Delivery</p>
            <div className="flex items-start">
              <input type="radio" checked readOnly className="mr-2 size-4 accent-blue-500" />
              <div className="ml-2 flex flex-col text-[0.875rem]">
                <p className="font-bold pb-1">Pay import fees on delivery</p>
                <p>
                  Est. delivery: Nov 28 – Dec 11<br></br>
                  eBay International Shipping 30 days returns accepted<br></br>
                  {`Shipping: ${sym}${shipping.toFixed(2)}`}
                </p>
                <p className="pt-2 text-[rgb(118,118,118)]">Import fees may apply on delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrder;


