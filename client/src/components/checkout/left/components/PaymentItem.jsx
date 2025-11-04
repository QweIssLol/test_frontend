import LogoBox from "../../../common/LogoBox";
import CloseBtn from "../../../../assets/close-btn.svg?react";
import { useState, useRef, useEffect, useCallback } from "react";
import CurrencyModal from "./CurrencyModal";
import { useCart } from "../../../../context/CartContext";

export default function PaymentItem({
  index,
  name,
  checked,
  onChange,
  onRequestSelect,
  logos = [],
  title,
  size = "md",
  disabled = false,
}) {
  const { setCurrency } = useCart();
  const renderInLogoBox = (el, key, boxSize = size, extraClass = "") => (
    <LogoBox key={key} size={boxSize} className={extraClass}>
      {el && el.type ? (
        <el.type
          {...el.props}
          className={`${
            el.props && el.props.className ? el.props.className + " " : ""
          }w-full h-full`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        el
      )}
    </LogoBox>
  );

  const tipButtonRef = useRef(null);
  const tipRef = useRef(null);
  const [tipStyle, setTipStyle] = useState(null);
  const [isTipOpen, setIsTipOpen] = useState(false);

  const updateTipPosition = useCallback(() => {
    if (tipButtonRef.current) {
      const r = tipButtonRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const desiredWidth = 300;
      const padding = 8;
      let left = r.left;
      if (left + desiredWidth > vw - padding) {
        left = Math.max(padding, vw - desiredWidth - padding);
      }
      left = Math.max(padding, left);
      setTipStyle({
        position: "fixed",
        left: `${left}px`,
        top: `${r.bottom}px`,
        width: `${desiredWidth}px`,
        zIndex: 60,
      });
    }
  }, []);

  const closeTip = () => setIsTipOpen(false);
  const openTip = () => {
    updateTipPosition();
    setIsTipOpen(true);
  };

  useEffect(() => {
    function handleDoc(e) {
      if (!isTipOpen) return;
      if (
        tipRef.current &&
        !tipRef.current.contains(e.target) &&
        tipButtonRef.current &&
        !tipButtonRef.current.contains(e.target)
      ) {
        setIsTipOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDoc);
    return () => document.removeEventListener("mousedown", handleDoc);
  }, [isTipOpen]);

  useEffect(() => {
    if (!isTipOpen) return;
    function handleScroll() {
      updateTipPosition();
    }
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isTipOpen, updateTipPosition]);
  const handleSelect = () => {
    if (disabled || checked) return;
    if (onRequestSelect) return onRequestSelect();
    onChange && onChange();
  };

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const handleCurrencyConfirm = (currency) => {
    setIsCurrencyOpen(false);
    if (currency) setCurrency(currency);
  };

  return (
    <>
      <div className="relative flex items-center pl-4 py-3 text-[0.875rem]">
        <div className="absolute "></div>
        {logos.length > 1 ? (
          <div className="flex flex-col">
            <div className="flex items-center">
              <div>
                <input
                  type="radio"
                  name={name}
                  checked={checked}
                  onChange={handleSelect}
                  className="mr-4 size-4 accent-blue-500"
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col">
                <div className="font-medium">{title}</div>
                <div className="flex items-center gap-1 pl-0.5 mt-1.5">
                  {logos.map((LogoEl, i) => (
                    <div
                      key={i}
                      className="border border-gray-400 rounded-[1px]"
                    >
                      {LogoEl}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center">
              <input
                type="radio"
                name={name}
                checked={checked}
                onChange={handleSelect}
                className="mr-4 size-4 accent-blue-500"
                disabled={disabled}
              />
              {renderInLogoBox(logos[0], "single", size, "mr-2 rounded-[2px]")}
              {title == "i" ? (
                <div className="relative">
                  <button
                    ref={tipButtonRef}
                    type="button"
                    aria-expanded={isTipOpen}
                    aria-label="More info"
                    onClick={openTip}
                    className="font-bold border-2 rounded-full px-2 scale-75"
                  >
                    {title}
                  </button>
                  {isTipOpen && (
                    <div
                      ref={tipRef}
                      style={tipStyle || undefined}
                      className="rounded py-2 px-4 shadow-md shadow-black/20 bg-white"
                    >
                      <div className="flex items-start">
                        <div className="flex-1 text-sm text-gray-800 font-medium max-h-56 overflow-y-auto">
                          Unfortunately, PayPal Credit is not available for this
                          purchase. Please select a different payment
                          <br />
                          method.
                        </div>
                        <CloseBtn onClick={closeTip} className="ml-3" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[0.875rem] font-medium">{title}</div>
              )}
            </div>
            {checked ? (
              <div className="flex flex-col pl-8">
                <p className="pt-1 text-gray-600 text-[0.875rem]">
                  Pay in the currency of your choice
                </p>
                <p className="pt-2 text-[0.875rem] cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setIsCurrencyOpen(true)}
                    className={`underline ${
                      isCurrencyOpen ? "text-black" : "text-black"
                    }`}
                  >
                    Change currency
                  </button>
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <CurrencyModal
        open={isCurrencyOpen}
        onClose={() => setIsCurrencyOpen(false)}
        onConfirm={handleCurrencyConfirm}
      />
    </>
  );
}
