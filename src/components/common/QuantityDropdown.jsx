import { useState, useRef, useEffect } from "react";

export default function QuantityDropdown({ value = 1, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  useEffect(() => setSelected(value), [value]);

  useEffect(() => {
    function handleDoc(e) {
      if (!open) return;
      if (
        listRef.current &&
        !listRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDoc);
    return () => document.removeEventListener("mousedown", handleDoc);
  }, [open]);

  useEffect(() => {
    function handleScroll() {
      if (open) {
        setOpen(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  function toggle() {
    if (!open && buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const padding = 8;
      const maxAllowedWidth = Math.max(120, vw - padding * 2);
      const desiredWidth = Math.min(r.width, maxAllowedWidth);
      let left = r.left;
      if (left + desiredWidth > vw - padding) {
        left = Math.max(padding, vw - desiredWidth - padding);
      }
      left = Math.max(padding, left);

      setDropdownStyle({
        position: "fixed",
        left: `${left}px`,
        top: `${r.bottom}px`,
        width: `${desiredWidth}px`,
        boxSizing: "border-box",
      });
    } else {
      setDropdownStyle(null);
    }
    setOpen((s) => !s);
  }

  function select(n) {
    setSelected(n);
    setOpen(false);
    onChange && onChange(n);
    buttonRef.current && buttonRef.current.focus();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      const next = Math.min(10, selected + 1);
      setSelected(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const prev = Math.max(1, selected - 1);
      setSelected(prev);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter") {
      if (open) {
        select(selected);
      } else {
        setOpen(true);
      }
    }
  }

  return (
    <div className="inline-block relative w-40">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="w-full border rounded-lg py-1 px-3 text-left bg-gray-100 flex items-center justify-between"
      >
        <div className="flex flex-col text-left">
          <span className="text-xs text-gray-500 leading-tight">Quantity</span>
          <span className="text-sm text-gray-800">{selected}</span>
        </div>
        <svg
          className="w-5 h-5 text-gray-600"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          style={dropdownStyle || undefined}
          className="z-50 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto"
        >
          {[...Array(10)].map((_, i) => {
            const n = i + 1;
            const isSelected = n === selected;
            return (
              <li
                key={n}
                role="option"
                aria-selected={isSelected}
                onClick={() => select(n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") select(n);
                }}
                className={`px-4 py-3 cursor-pointer text-sm ${
                  isSelected ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                }`}
              >
                {n}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
